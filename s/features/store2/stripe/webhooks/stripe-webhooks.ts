
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {PermissionsInteractions} from "../../interactions/interactions-types.js"
import {getPriceIdsFromInvoice, fulfillUserRolesForSubscription, updateCustomerPaymentMethod, getInvoiceDetails, getPaymentMethodIdFromPaymentIntent, fulfillSubscriptionRoles, getSubscriptionDetails, getPriceIdsFromSubscription} from "./helpers/webhook-helpers.js"

export function stripeWebhooks(options: {
		logger: Logger
		stripeLiaison: StripeLiaison
		storeDatabaseRaw: StoreDatabaseRaw
		preparePermissionsInteractions: (appId: dbmage.Id) => PermissionsInteractions
	}) {
	const {logger, preparePermissionsInteractions} = options

	return {

		async "customer.subscription.updated"(event: Stripe.Event) {
			logger.info(
				"stripe-webhook customer.subscription.updated",
				event.data.object
			)
			const {appId, subscription, userId, storeDatabase} = (
				await getSubscriptionDetails({...options, event})
			)
			const permissionsInteractions = preparePermissionsInteractions(appId)
			const priceIds = getPriceIdsFromSubscription(subscription)
			await fulfillSubscriptionRoles({
				userId,
				priceIds,
				storeDatabase,
				permissionsInteractions,
				periodInEpochSeconds: {
					start: subscription.current_period_start,
					end: subscription.current_period_end,
				},
			})
		},

		async "checkout.session.completed"(event: Stripe.Event) {
			// logger.info("stripe-webhook checkout.session.completed:", event.data.object)
		},

		async "invoice.paid"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.paid:", event.data.object)
			const details = await getInvoiceDetails({...options, event})
			const invoiceIsForSubscription = !!details.invoice.subscription
			const permissionsInteractions = preparePermissionsInteractions(details.appId)

			if (invoiceIsForSubscription){
				await fulfillUserRolesForSubscription({
					...details,
					permissionsInteractions,
					priceIds: getPriceIdsFromInvoice(details.invoice),
				})
				// await updateCustomerPaymentMethod({
				// 	...details,
				// 	stripePaymentMethodId: await getPaymentMethodIdFromPaymentIntent(details),
				// })
			}

			else
				logger.error(`unknown 'invoice.paid' hook (not for a subscription)`)
		},

		async "invoice.payment_failed"(event: Stripe.Event) {
			// logger.info("stripe-webhook invoice.payment_failed", event.data.object)
		},
		async "customer.subscription.created"(event: Stripe.Event) {},
		async "customer.subscription.deleted"(event: Stripe.Event) {
			// logger.info(
			// 	"stripe-webhook customer.subscription.deleted", event.data.object
			// )
		},
	}
}
