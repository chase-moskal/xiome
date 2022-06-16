
import {Stripe} from "stripe"

import {StripeLiaison} from "../liaison/types.js"
import {StoreDatabaseRaw} from "../../types/store-schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {getStripeId} from "../liaison/helpers/get-stripe-id.js"
import {PermissionsInteractions} from "../../interactions/interactions.js"
import {getCheckoutSessionForEvent, getDatabaseForApp, getPaymentMethodId, getReferencedClient, userIsUpdatingTheirPaymentMethod, webhookHelpers} from "./helpers/webhook-helpers.js"

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
			const session = getCheckoutSessionForEvent(event)
			const {appId, userId} = getReferencedClient(session)
			const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
			const stripeLiaisonAccount = stripeLiaison.account(event.account)
			const stripeCustomerId = getStripeId(session.customer)

			if (userIsUpdatingTheirPaymentMethod(session)) {
				const stripePaymentMethodId = await getPaymentMethodId(
					stripeLiaisonAccount,
					session,
				)
				await updateCustomerDefaultPaymentMethod(stripePaymentMethodId)
				await detachAllOtherPaymentMethods()
				await updateAllSubscriptionsToUseThisPaymentMethod()
			}
			else if (userIsPurchasingASubscription()) {
				await fulfillRolesRelatedToSubscription()
			}
			else {
				logger.error("unknown 'checkout.session.completed' event subtype")
			}
		},

		async "invoice.paid"(event: Stripe.Event) {},
		async "invoice.payment_failed"(event: Stripe.Event) {},
		async "customer.subscription.created"(event: Stripe.Event) {},
		async "customer.subscription.updated"(event: Stripe.Event) {},
	}
}
