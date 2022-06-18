
import {Stripe} from "stripe"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {PermissionsInteractions} from "../../interactions/interactions.js"
import {fulfillRolesRelatedToSubscription, getCheckoutSessionForEvent, getDatabaseForApp, getPaymentMethodId, getPriceIdsFromInvoice, getReferencedClient, getStripeCustomerDetails, getStripeSubscription, handleRolesFufilment, updateCustomerPaymentMethod, userIsPurchasingASubscription, userIsUpdatingTheirPaymentMethod} from "./helpers/webhook-helpers.js"

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
			const session = getCheckoutSessionForEvent(event)
			const {appId, userId} = getReferencedClient(session)
			const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			const stripeCustomerId = getStripeId(session.customer)
			if (userIsUpdatingTheirPaymentMethod(session))
				await updateCustomerPaymentMethod({
					stripeCustomerId,
					stripeLiaisonAccount,
					stripePaymentMethodId: await getPaymentMethodId(
						stripeLiaisonAccount,
						session,
					),
				})
			else if (userIsPurchasingASubscription(session))
				await fulfillRolesRelatedToSubscription({
					userId,
					session,
					storeDatabase,
					permissionsInteractions,
					subscription: await getStripeSubscription(
						stripeLiaisonAccount, session.subscription
					)
				})
			else
				logger.error("unknown 'checkout.session.completed' event subtype")
		},

		async "invoice.paid"(event: Stripe.Event) {
			logger.info("stripe-webhook invoice.paid:", event.data.object)
			const invoice = <Stripe.Invoice>event.data.object
			const customerId = getStripeId(invoice.customer)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			const {storeDatabase, userId} = await getStripeCustomerDetails(
				storeDatabaseRaw, customerId
			)
			if (invoice.subscription)
				handleRolesFufilment({
					userId,
					storeDatabase,
					permissionsInteractions,
					priceIds: getPriceIdsFromInvoice(invoice),
					subscription: await getStripeSubscription(
						stripeLiaisonAccount, invoice.subscription
					),
				})
		},

		async "invoice.payment_failed"(event: Stripe.Event) {},
		async "customer.subscription.created"(event: Stripe.Event) {},
		async "customer.subscription.updated"(event: Stripe.Event) {},
	}
}
