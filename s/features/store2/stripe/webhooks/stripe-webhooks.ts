
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {PermissionsInteractions} from "../../interactions/interactions-types.js"
import {getPriceIdsFromInvoice, fulfillUserRolesForSubscription, updateCustomerPaymentMethod, getInvoiceDetails, getPaymentMethodIdFromPaymentIntent, fulfillSubscriptionRoles, getSubscriptionDetails, getPriceIdsFromSubscription, getSessionDetails, getTiersForStripePrices} from "./helpers/webhook-helpers.js"
import {findSubscriptionforPlanRelatingToTier} from "../../api/services/helpers/get-current-stripe-subscription.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"

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
			logger.info("stripe-webhook checkout.session.completed:", event.data.object)

			// const {session, storeDatabase, stripeLiaisonAccount}
			// 	= await getSessionDetails({...options, event})

			// debugger

			// if (session.mode === "subscription") {
			// 	// const priceIds = session.line_items.data
			// 	// 	.map(item => getStripeId(item.price))
			// 	// // const {tierRows} = await getTiersForStripePrices({priceIds, storeDatabase})

			// 	const subscription = await stripeLiaisonAccount.subscriptions
			// 		.retrieve(getStripeId(session.subscription))

			// 	subscription;

			// 	debugger

			// 	// const unwantedSubscriptionItems = subscription.items.data
			// 	// 	.filter(item => !priceIds.includes(getStripeId(item.price)))

			// 	// for (const item of unwantedSubscriptionItems) {
			// 	// 	await stripeLiaisonAccount.subscriptionItems.del(
			// 	// 		item.id,
			// 	// 		{proration_behavior: "create_prorations"}
			// 	// 	)
			// 	// }
			// }
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
