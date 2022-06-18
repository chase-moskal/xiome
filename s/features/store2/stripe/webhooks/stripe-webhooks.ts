
import {Stripe} from "stripe"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {PermissionsInteractions} from "../../interactions/interactions.js"
import {getDatabaseForApp, getPaymentMethodId, getPriceIdsFromInvoice, getReferencedClient, getStripeCustomerDetails, getStripeSubscription, getSubscriptionAndPriceIds, fulfillUserRolesForSubscription, updateCustomerPaymentMethod} from "./helpers/webhook-helpers.js"

export function stripeWebhooks({
		logger, stripeLiaison, storeDatabaseRaw, permissionsInteractions,
	}: {
		logger: Logger
		stripeLiaison: StripeLiaison
		storeDatabaseRaw: StoreDatabaseRaw
		permissionsInteractions: PermissionsInteractions
	}) {

	return {

		async "checkout.session.completed"(event: Stripe.Event) {
			logger.info("stripe-webhook checkout.session.completed:", event.data.object)
			const session = <Stripe.Checkout.Session>event.data.object
			const userIsUpdatingTheirPaymentMethod = session.mode === "setup"
			const userIsPurchasingASubscription = session.mode === "subscription"
			const stripeCustomerId = getStripeId(session.customer)
			const {appId, userId} = getReferencedClient(session)
			const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			if (userIsUpdatingTheirPaymentMethod)
				await updateCustomerPaymentMethod({
					stripeCustomerId,
					stripeLiaisonAccount,
					stripePaymentMethodId: await getPaymentMethodId(
						stripeLiaisonAccount,
						session,
					),
				})
			else if (userIsPurchasingASubscription)
				await fulfillUserRolesForSubscription({
					userId,
					storeDatabase,
					permissionsInteractions,
					...await getSubscriptionAndPriceIds(stripeLiaisonAccount, session),
				})
			else
				logger.error(`unknown 'checkout.session.completed' mode "${session.mode}"`)
		},

		async "invoice.paid"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.paid:", event.data.object)
			const invoice = <Stripe.Invoice>event.data.object
			const invoiceIsForSubscription = !!invoice.subscription
			const stripeCustomerId = getStripeId(invoice.customer)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			const {storeDatabase, userId} = await getStripeCustomerDetails(
				storeDatabaseRaw,
				stripeCustomerId,
			)
			if (invoiceIsForSubscription)
				await fulfillUserRolesForSubscription({
					userId,
					storeDatabase,
					permissionsInteractions,
					priceIds: getPriceIdsFromInvoice(invoice),
					subscription: await getStripeSubscription(
						stripeLiaisonAccount,
						invoice.subscription,
					),
				})
			else
				logger.error(`unknown 'invoice.paid' hook (not for a subscription)`)
		},

		async "invoice.payment_failed"(event: Stripe.Event) {},
		async "customer.subscription.created"(event: Stripe.Event) {},
		async "customer.subscription.updated"(event: Stripe.Event) {},
	}
}
