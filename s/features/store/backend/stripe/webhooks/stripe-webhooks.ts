
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../database/types/schema.js"
import {Logger} from "../../../../../toolbox/logger/interfaces.js"
import {fulfillSubscriptionRoles} from "../fulfillment/fulfillment.js"
import {RoleManager} from "../../../../auth/aspects/permissions/interactions/types.js"
import {timerangeFromStripePeriod} from "../utils/seconds-to-millisecond-timerange.js"
import {getPriceIdsFromInvoice, getInvoiceDetails, getSubscriptionDetails, getPriceIdsFromSubscription, getConnectAccountDetails} from "./helpers/webhook-helpers.js"

export function stripeWebhooks(options: {
		logger: Logger
		stripeLiaison: StripeLiaison
		storeDatabaseRaw: StoreDatabaseRaw
		prepareRoleManager: (appId: dbmage.Id) => RoleManager
	}) {
	const {logger, prepareRoleManager} = options

	return {

		async "account.updated"(event: Stripe.Event) {
			const account = <Stripe.Account>event.data.object
			const stripeAccountId = account.id

			const known = await getConnectAccountDetails({
				...options,
				stripeAccountId,
			})

			if (known) {
				const {storeDatabase, connectAccount: {connectId}} = known
				await storeDatabase
					.tables
					.connect
					.accounts
					.update({
						...dbmage.find({connectId}),
						write: {
							email: account.email,
							charges_enabled: account.charges_enabled,
							payouts_enabled: account.payouts_enabled,
							details_submitted: account.details_submitted,
						},
					})
			}
		},

		async "customer.subscription.updated"(event: Stripe.Event) {
			logger.info(
				"stripe-webhook customer.subscription.updated",
				event.data.object
			)
			const {appId, subscription, userId, storeDatabase, stripeLiaisonAccount} = (
				await getSubscriptionDetails({...options, event})
			)
			const roleManager = prepareRoleManager(appId)
			const priceIds = getPriceIdsFromSubscription(subscription)
			await fulfillSubscriptionRoles({
				userId,
				priceIds,
				storeDatabase,
				stripeLiaisonAccount,
				roleManager,
				timerange: timerangeFromStripePeriod({
					start: subscription.current_period_start,
					end: subscription.current_period_end,
				}),
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

			const {invoice, appId, userId, storeDatabase, stripeLiaisonAccount}
				= await getInvoiceDetails({...options, event})

			const invoiceIsForSubscription = !!invoice.subscription
			const roleManager = prepareRoleManager(appId)

			if (invoiceIsForSubscription)
				await fulfillSubscriptionRoles({
					userId,
					storeDatabase,
					stripeLiaisonAccount,
					roleManager,
					priceIds: getPriceIdsFromInvoice(invoice),
					timerange: timerangeFromStripePeriod(invoice.lines.data[0].period),
				})

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
