
import {Stripe} from "stripe"
import * as dbmage from "dbmage"
import {objectMap} from "@chasemoskal/snapstate"

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

	const webhooks = {
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
			const {
				appId,
				subscription,
				userId,
				storeDatabase,
				stripeLiaisonAccount,
			} = await getSubscriptionDetails({...options, event})

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

		async "invoice.paid"(event: Stripe.Event) {
			const {invoice, appId, userId, storeDatabase, stripeLiaisonAccount} =
				await getInvoiceDetails({...options, event})

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
	}

	type WebhookFunction = (event: Stripe.Event) => Promise<any>

	const webhooksWithLogging = objectMap(
		webhooks,
		(webhookFunction: WebhookFunction, functionName) => <WebhookFunction>(
			async event => {
				logger.info(
					`stripe-webhook ${functionName}:`,
					event.data.object,
				)
				return webhookFunction(event)
			}
		)
	)

	return webhooksWithLogging
}
