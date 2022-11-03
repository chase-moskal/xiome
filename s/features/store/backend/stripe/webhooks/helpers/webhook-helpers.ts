
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {StripeLiaison} from "../../liaison/types.js"
import {getStripeId} from "../../utils/get-stripe-id.js"
import {stripeClientReferenceId} from "../../utils/stripe-client-reference-id.js"
import {StoreDatabase, StoreDatabaseRaw} from "../../../database/types/schema.js"
import {appConstraintKey} from "../../../../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../../../../framework/api/unconstrained-table.js"

type OptionsForDetails = {
	event: Stripe.Event
	stripeLiaison: StripeLiaison
	storeDatabaseRaw: StoreDatabaseRaw
}

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

export async function getConnectAccountDetails({
		stripeAccountId,
		storeDatabaseRaw,
	}: {
		stripeAccountId: string
		storeDatabaseRaw: StoreDatabaseRaw
	}) {

	const connectAccount =
		await storeDatabaseRaw
			.tables
			.connect
			.accounts
			.unconstrained
			.readOne(dbmage.find({stripeAccountId}))

	if (connectAccount) {
		const appId = connectAccount[appConstraintKey]
		const storeDatabase = getDatabaseForApp(storeDatabaseRaw, appId)
		return {connectAccount, appId, storeDatabase}
	}
	else
		return undefined
}

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
