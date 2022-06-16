
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {Logger} from "../../../../../toolbox/logger/interfaces.js"
import {StripeLiaison, StripeLiaisonAccount} from "../../liaison/types.js"
import {StoreDatabase, StoreDatabaseRaw} from "../../../types/store-schema.js"
import {PermissionsInteractions} from "../../../interactions/interactions.js"
import {stripeClientReferenceId} from "../../utils/stripe-client-reference-id.js"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"
import {getStripeId} from "../../liaison/helpers/get-stripe-id.js"

export function getCheckoutSessionForEvent(event: Stripe.Event) {
	return <Stripe.Checkout.Session>event.data.object
}

export function getReferencedClient(session: Stripe.Checkout.Session) {
	const raw = stripeClientReferenceId.parse(session.client_reference_id)
	const appId = dbmage.Id.fromString(raw.appId)
	const userId = dbmage.Id.fromString(raw.userId)
	return {appId, userId}
}

export function getDatabaseForApp(storeDatabaseRaw: StoreDatabaseRaw, appId: dbmage.Id) {
	return <StoreDatabase>UnconstrainedTable.constrainDatabaseForApp({
		appId,
		database: storeDatabaseRaw,
	})
}

export async function getStripeSubscription(
		stripeLiaisonAccount: StripeLiaisonAccount,
		s: string | Stripe.Subscription,
	): Promise<Stripe.Subscription> {
	return typeof s === "string"
		? await stripeLiaisonAccount.subscriptions.retrieve(s)
		: <Stripe.Subscription>s
}

export async function getStripeSetupIntent(
		stripeLiaisonAccount: StripeLiaisonAccount,
		s: string | Stripe.SetupIntent,
	): Promise<Stripe.SetupIntent> {
	return typeof s === "string"
		? await stripeLiaisonAccount.setupIntents.retrieve(s)
		: <Stripe.SetupIntent>s
}

export function userIsUpdatingTheirPaymentMethod(
		session: Stripe.Checkout.Session
	): boolean {
	return session.mode === "setup"
}

export async function getPaymentMethodId(
		stripeLiaisonAccount: StripeLiaisonAccount,
		session: Stripe.Checkout.Session,
	): Promise<string> {
	const intent = await getStripeSetupIntent(
		stripeLiaisonAccount,
		session.setup_intent)
	return getStripeId(intent.payment_method)
}
