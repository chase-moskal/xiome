
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {PermissionsInteractions} from "../../interactions/interactions-types.js"
import {getPaymentMethodIdFromSetupIntent, getPriceIdsFromInvoice, getStripeSubscription, getSubscriptionAndPriceIds, fulfillUserRolesForSubscription, updateCustomerPaymentMethod, getSessionDetails, getInvoiceDetails, getPaymentMethodIdFromPaymentIntent} from "./helpers/webhook-helpers.js"

export function stripeWebhooks(options: {
		logger: Logger
		stripeLiaison: StripeLiaison
		storeDatabaseRaw: StoreDatabaseRaw
		preparePermissionsInteractions: (appId: dbmage.Id) => PermissionsInteractions
	}) {
	const {logger, preparePermissionsInteractions} = options

	return {

		// TODO: perherps this webhook handler should not exist (or not do anything)
		async "checkout.session.completed"(event: Stripe.Event) {
			logger.info("stripe-webhook checkout.session.completed:", event.data.object)
			const details = await getSessionDetails({...options, event})
			const userIsUpdatingTheirPaymentMethod = details.session.mode === "setup"
			const userIsPurchasingASubscription = details.session.mode === "subscription"
			const permissionsInteractions = preparePermissionsInteractions(details.appId)

			if (userIsUpdatingTheirPaymentMethod)
				await updateCustomerPaymentMethod({
					...details,
					stripePaymentMethodId: await getPaymentMethodIdFromSetupIntent(details),
				})

			else if (userIsPurchasingASubscription) {
				await fulfillUserRolesForSubscription({
					...details,
					...await getSubscriptionAndPriceIds(details),
					permissionsInteractions,
				})
				await updateCustomerPaymentMethod({
					...details,
					stripePaymentMethodId: await getPaymentMethodIdFromPaymentIntent(details),
				})
			}

			else
				logger.error(`unknown 'checkout.session.completed' mode "${details.session.mode}"`)
		},

		async "invoice.paid"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.paid:", event.data.object)
			const details = await getInvoiceDetails({...options, event})
			const invoiceIsForSubscription = !!details.invoice.subscription
			const permissionsInteractions = preparePermissionsInteractions(details.appId)

			if (invoiceIsForSubscription)
				await fulfillUserRolesForSubscription({
					...details,
					permissionsInteractions,
					priceIds: getPriceIdsFromInvoice(details.invoice),
					subscription: await getStripeSubscription(
						details.stripeLiaisonAccount,
						details.invoice.subscription,
					),
				})

			else
				logger.error(`unknown 'invoice.paid' hook (not for a subscription)`)
		},

		async "invoice.payment_failed"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.payment_failed", event.data.object)
		},
		async "customer.subscription.created"(event: Stripe.Event) {},
		async "customer.subscription.updated"(event: Stripe.Event) {},
	}
}
