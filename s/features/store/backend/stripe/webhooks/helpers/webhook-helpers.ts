
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {getStripeId} from "../../utils/get-stripe-id.js"
import {StripeLiaison, StripeLiaisonAccount} from "../../liaison/types.js"
import {stripeClientReferenceId} from "../../utils/stripe-client-reference-id.js"
import {StoreDatabase, StoreDatabaseRaw} from "../../../database/types/schema.js"
import {appConstraintKey} from "../../../../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../../../../framework/api/unconstrained-table.js"

type PaymentDetails = {
	stripeCustomerId: string
	stripePaymentMethodId: string
	stripeLiaisonAccount: StripeLiaisonAccount
}

type OptionsForDetails = {
	event: Stripe.Event
	stripeLiaison: StripeLiaison
	storeDatabaseRaw: StoreDatabaseRaw
}

// export async function getSessionDetails({
// 		event, stripeLiaison, storeDatabaseRaw
// 	}: OptionsForDetails) {
// 	const session = <Stripe.Checkout.Session>event.data.object
// 	const stripeCustomerId = getStripeId(session.customer)
// 	const {appId, userId} = getReferencedClient(session)
// 	const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
// 	const stripeLiaisonAccount = stripeLiaison.account(event.account)
// 	return {
// 		appId,
// 		userId,
// 		session,
// 		storeDatabase,
// 		stripeCustomerId,
// 		stripeLiaisonAccount,
// 	}
// }

export async function getInvoiceDetails({
		event, stripeLiaison, storeDatabaseRaw
	}: OptionsForDetails) {
	const invoice = <Stripe.Invoice>event.data.object
	const stripeCustomerId = getStripeId(invoice.customer)
	const stripeLiaisonAccount = stripeLiaison.account(event.account)
	const {storeDatabase, userId, appId} = await getStripeCustomerDetails(
		storeDatabaseRaw,
		stripeCustomerId,
	)
	return {
		appId,
		userId,
		invoice,
		storeDatabase,
		stripeCustomerId,
		stripeLiaisonAccount,
	}
}

export async function getSubscriptionDetails({
		event, stripeLiaison, storeDatabaseRaw
	}: OptionsForDetails) {
	const subscription = <Stripe.Subscription>event.data.object
	const stripeCustomerId = getStripeId(subscription.customer)
	const stripeLiaisonAccount = stripeLiaison.account(event.account)
	const {storeDatabase, userId, appId} = await getStripeCustomerDetails(
		storeDatabaseRaw,
		stripeCustomerId,
	)
	return {
		appId,
		userId,
		subscription,
		storeDatabase,
		stripeCustomerId,
		stripeLiaisonAccount,
	}
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

// export async function getStripeSubscription(
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		s: string | Stripe.Subscription,
// 	): Promise<Stripe.Subscription> {
// 	return typeof s === "string"
// 		? await stripeLiaisonAccount.subscriptions.retrieve(s)
// 		: <Stripe.Subscription>s
// }

// export async function getStripeSetupIntent(
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		s: string | Stripe.SetupIntent,
// 	): Promise<Stripe.SetupIntent> {
// 	return typeof s === "string"
// 		? await stripeLiaisonAccount.setupIntents.retrieve(s)
// 		: <Stripe.SetupIntent>s
// }

// export async function getStripePaymentIntent(
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		s: string | Stripe.PaymentIntent,
// 	): Promise<Stripe.PaymentIntent> {
// 	return typeof s === "string"
// 		? await stripeLiaisonAccount.paymentIntents.retrieve(s)
// 		: <Stripe.PaymentIntent>s
// }

// export async function getPaymentMethodIdFromSetupIntent({
// 		stripeLiaisonAccount, session,
// 	}: {
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		session: Stripe.Checkout.Session,
// 	}): Promise<string> {
// 	const intent = await getStripeSetupIntent(
// 		stripeLiaisonAccount,
// 		session.setup_intent)
// 	return getStripeId(intent.payment_method)
// }

// export async function getPaymentMethodIdFromPaymentIntent({
// 		stripeLiaisonAccount, invoice,
// 	}: {
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		invoice: Stripe.Invoice,
// 	}): Promise<string> {
// 	const intent = await getStripePaymentIntent(
// 		stripeLiaisonAccount,
// 		invoice.payment_intent)
// 	return getStripeId(intent.payment_method)
// }

// export async function updateCustomerDefaultPaymentMethod ({
// 		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
// 	}: PaymentDetails) {
// 	await stripeLiaisonAccount.customers.update(stripeCustomerId, {
// 		invoice_settings: {
// 			default_payment_method: stripePaymentMethodId,
// 		},
// 	})
// }

// export async function detachAllOtherPaymentMethods ({
// 		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
// 	}: PaymentDetails) {
// 	const paymentMethods = await stripeLiaisonAccount
// 		.customers.listPaymentMethods(stripeCustomerId, {type: "card"})
// 	for (const paymentMethod of paymentMethods.data) {
// 		if (paymentMethod.id !== stripePaymentMethodId)
// 			await stripeLiaisonAccount.paymentMethods.detach(paymentMethod.id)
// 	}
// }

// export async function updateAllSubscriptionsToUseThisPaymentMethod ({
// 		stripeCustomerId, stripePaymentMethodId, stripeLiaisonAccount,
// 	}: PaymentDetails) {

// 	const subscriptions = await stripeLiaisonAccount
// 		.subscriptions
// 		.list({customer: stripeCustomerId, status: "all"})

// 	for (const {id, status} of subscriptions.data) {
// 		if (status !== "incomplete_expired")
// 			await stripeLiaisonAccount
// 				.subscriptions
// 				.update(id, {
// 					default_payment_method: stripePaymentMethodId
// 				})
// 	}
// }

// export async function updateCustomerPaymentMethod(details: PaymentDetails) {
// 	await updateCustomerDefaultPaymentMethod(details)
// 	await detachAllOtherPaymentMethods(details)
// 	await updateAllSubscriptionsToUseThisPaymentMethod(details)
// }

export async function getStripeCustomerDetails(
		storeDatabaseRaw: StoreDatabaseRaw,
		stripeCustomerId: string,
	) {
	const row = await storeDatabaseRaw.tables.customers.unconstrained
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

// export async function getSubscriptionAndPriceIds({
// 		stripeLiaisonAccount, session,
// 	}: {
// 		stripeLiaisonAccount: StripeLiaisonAccount,
// 		session: Stripe.Checkout.Session
// 	}) {
// 	const subscription = await getStripeSubscription(
// 		stripeLiaisonAccount,
// 		session.subscription,
// 	)
// 	return {subscription, priceIds: getPriceIdsFromSubscription(subscription)}
// }

export function getPriceIdsFromSubscription(subscription: Stripe.Subscription) {
	return subscription.items.data.map(item => getStripeId(item.price))
}

export function getPriceIdsFromInvoice(invoice: Stripe.Invoice) {
	const recurringItems = invoice.lines.data
		.filter(line => line.price.type === "recurring")
	const setOfPriceIds = new Set<string>()
	for (const {price} of recurringItems)
		setOfPriceIds.add(price.id)
	return [...setOfPriceIds]
}
