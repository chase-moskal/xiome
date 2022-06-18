
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaisonAccount} from "../../liaison/types.js"
import {StoreDatabase, StoreDatabaseRaw} from "../../../types/store-schema.js"
import {PermissionsInteractions} from "../../../interactions/interactions.js"
import {stripeClientReferenceId} from "../../utils/stripe-client-reference-id.js"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"
import {getStripeId} from "../../liaison/helpers/get-stripe-id.js"
import {appConstraintKey} from "../../../../../assembly/backend/types/database.js"
import {dedupeIds} from "../../../../../toolbox/dedupe.js"

type PaymentDetails = {
	stripeCustomerId: string
	stripePaymentMethodId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}

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

export async function getTiersForStripePrices({
		priceIds,
		storeDatabase,
	}: {
		priceIds: string[]
		storeDatabase: StoreDatabase
	}) {

	if (priceIds.length === 0)
		throw new Error("prices not found in subscription from stripe")

	const tierRows = await storeDatabase.tables.subscriptions.tiers
		.read(dbmage.findAll(priceIds, id => ({stripePriceId: id})))

	// const planIds = dedupeIds(tierRows.map(row => row.planId))
	// if (planIds.length === 0)
	// 	throw new Error("subscription plans not found")

	// const planRows = await storeDatabase.tables.subscriptions.plans
	// 	.read(dbmage.findAll(planIds, planId => ({planId})))

	return {
		tierRows,
		// planRows,
	}
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

export async function updateCustomerDefaultPaymentMethod ({
		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
	}: PaymentDetails) {
	await stripeLiaisonAccount.customers.update(stripeCustomerId, {
		invoice_settings: {
			default_payment_method: stripePaymentMethodId,
		},
	})
}

export async function detachAllOtherPaymentMethods ({
		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
	}: PaymentDetails) {
	const paymentMethods = await stripeLiaisonAccount
		.customers.listPaymentMethods(stripeCustomerId, {type: "card"})
	for (const paymentMethod of paymentMethods.data) {
		if (paymentMethod.id !== stripePaymentMethodId)
			await stripeLiaisonAccount.paymentMethods.detach(paymentMethod.id)
	}
}

export async function updateAllSubscriptionsToUseThisPaymentMethod ({
		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
	}: PaymentDetails) {
	const subscriptions = await stripeLiaisonAccount
		.subscriptions.list({customer: stripeCustomerId})
	for (const subscription of subscriptions.data) {
		if (subscription.status !== "canceled") {
			await stripeLiaisonAccount.subscriptions.update(subscription.id, {
				default_payment_method: stripePaymentMethodId,
			})
		}
	}
}

export function userIsPurchasingASubscription(
		session: Stripe.Checkout.Session
	) {
	return session.mode === "subscription"
}

// export async function handleRolesFufilment({
// 		userId,
// 		priceIds,
// 		subscription,
// 		storeDatabase,
// 		permissionsInteractions,
// 	}:{
// 		userId: dbmage.Id
// 		priceIds: string[]
// 		storeDatabase: StoreDatabase
// 		subscription: Stripe.Subscription
// 		permissionsInteractions: PermissionsInteractions
// 	}) {
// 	const {tierRows} = await getTiersForStripePrices({
// 		priceIds,
// 		storeDatabase,
// 	})
// 	const roleIds = tierRows.map(tierRow => tierRow.roleId)
// 	await permissionsInteractions.grantUserRoles({
// 		timeframeEnd: subscription.current_period_end,
// 		timeframeStart: subscription.current_period_start,
// 		roleIds,
// 		userId,
// 	})
// }

export async function fulfillRolesRelatedToSubscription({
		userId, storeDatabase, session, subscription, permissionsInteractions
	}: {
		userId: dbmage.Id
		storeDatabase: StoreDatabase
		session: Stripe.Checkout.Session
		subscription: Stripe.Subscription
		permissionsInteractions: PermissionsInteractions
	}) {
	const priceIds = subscription.items.data.map(item => getStripeId(item.price))
	handleRolesFufilment({
		userId,
		priceIds,
		storeDatabase,
		subscription,
		permissionsInteractions
	})
}

export async function updateCustomerPaymentMethod(details: PaymentDetails) {
	await updateCustomerDefaultPaymentMethod(details)
	await detachAllOtherPaymentMethods(details)
	await updateAllSubscriptionsToUseThisPaymentMethod(details)
}

export async function getStripeCustomerDetails(
		storeDatabaseRaw: StoreDatabaseRaw, stripeCustomerId: string
	) {
	const row = await storeDatabaseRaw.tables.billing.customers.unconstrained
		.readOne(dbmage.find({stripeCustomerId}))
	if (!row)
		throw new Error(`stripe customer id not found in billing "${stripeCustomerId}"`)
	const appId = row[appConstraintKey]
	const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
	const {userId} = row
	return {
		appId,
		userId,
		storeDatabase,
	}
}

// export function getPriceIdsFromSubscription(subscription: Stripe.Subscription) {
// 	return subscription.items.data.map(item => getStripeId(item.price))
// }

export async function getPriceIdsFromSubscription(
		session: Stripe.Checkout.Session,
		stripeLiaisonAccount: StripeLiaisonAccount
	) {
	const subscription = await getStripeSubscription(
		stripeLiaisonAccount, session.subscription
	)
	return subscription.items.data.map(item => getStripeId(item.price))
}

export function getPriceIdsFromInvoice(invoice: Stripe.Invoice) {
	const recurringItems = invoice.lines.data
		.filter(line => line.price.type === "recurring")

	const setOfPriceIds = new Set<string>()
	for (const {price} of recurringItems) {
		setOfPriceIds.add(price.id)
	}
	return [...setOfPriceIds]
}

export async function handleRolesFufilment({
		userId,
		priceIds,
		subscription,
		storeDatabase,
		permissionsInteractions,
	}:{
		userId: dbmage.Id
		priceIds: string[]
		storeDatabase: StoreDatabase
		subscription: Stripe.Subscription
		permissionsInteractions: PermissionsInteractions
	}) {
	const {tierRows} = await getTiersForStripePrices({
		priceIds,
		storeDatabase,
	})
	const roleIds = tierRows.map(tierRow => tierRow.roleId)
	await permissionsInteractions.grantUserRoles({
		timeframeEnd: subscription.current_period_end,
		timeframeStart: subscription.current_period_start,
		roleIds,
		userId,
	})
}
