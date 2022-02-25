
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {dedupe} from "../../../../../toolbox/dedupe.js"
import {StripeLiaison} from "../../../types/store-concepts.js"
import {makeStripeLiaison} from "../../liaison/stripe-liaison.js"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"
import {SubscriptionPlanRow, SubscriptionTierRow} from "../../../types/store-schema.js"
import {stripeClientReferenceId} from "../../../api/utils/stripe-client-reference-id.js"
import {appConstraintKey, DatabaseRaw, DatabaseSafe} from "../../../../../assembly/backend/types/database.js"
import {getStripeId} from "../../liaison/helpers/get-stripe-id.js"

export function webhookHelpers(
		stripeLiaisonAccount: ReturnType<ReturnType<typeof makeStripeLiaison>["account"]>
	) {
	return {

		async getStripeSubscription(
				s: string | Stripe.Subscription
			): Promise<Stripe.Subscription> {
			return typeof s === "string"
				? await stripeLiaisonAccount.subscriptions.retrieve(s)
				: <Stripe.Subscription>s
		},

		async getStripeSetupIntent(
				s: string | Stripe.SetupIntent
			): Promise<Stripe.SetupIntent> {
			return typeof s === "string"
				? await stripeLiaisonAccount.setupIntents.retrieve(s)
				: <Stripe.SetupIntent>s
		},
	}
}

export async function getFundamentalsAboutStripeCustomer(databaseRaw: DatabaseRaw, stripeCustomerId: string) {
	const row = await databaseRaw.tables.store.billing.customers.unconstrained
		.readOne(dbmage.find({stripeCustomerId}))
	if (!row)
		throw new Error(`stripe customer id not found in billing "${stripeCustomerId}"`)
	const appId = row[appConstraintKey]
	const {userId} = row
	const database = <DatabaseSafe>UnconstrainedTable.constrainDatabaseForApp({
		appId,
		database: databaseRaw,
	})
	return {
		appId,
		userId,
		database,
	}
}

export function getCheckoutDetails({
		event,
		databaseRaw,
		stripeLiaison,
	}: {
		event: Stripe.Event
		databaseRaw: DatabaseRaw
		stripeLiaison: StripeLiaison
	}) {

	const session = <Stripe.Checkout.Session>event.data.object
	const raw = stripeClientReferenceId.parse(session.client_reference_id)
	const appId = dbmage.Id.fromString(raw.appId)
	const userId = dbmage.Id.fromString(raw.userId)
	const database = <DatabaseSafe>UnconstrainedTable
		.constrainDatabaseForApp({
			appId,
			database: databaseRaw,
		})
	const stripeAccount = event.account
	const stripeLiaisonAccount = stripeLiaison.account(stripeAccount)
	const helpers = webhookHelpers(stripeLiaisonAccount)
	return {
		stripeCustomerId: getStripeId(session.customer),
		session,
		stripeAccount,
		stripeLiaisonAccount,
		helpers,
		appId,
		userId,
		database,
	}
}

export async function getTiersAndPlansForStripePrices({
		priceIds,
		database,
	}: {
		priceIds: string[]
		database: DatabaseSafe
	}) {

	if (priceIds.length === 0)
		throw new Error("prices not found in subscription from stripe")

	const tierRows = await database.tables.store.subscriptions.tiers
		.read(dbmage.findAll(priceIds, id => ({stripePriceId: id})))

	const planIds = dedupe(
			tierRows.map(row => row.planId.string)
		)
		.map(id => dbmage.Id.fromString(id))

	if (planIds.length === 0)
		throw new Error("subscription plans not found")

	const planRows = await database.tables.store.subscriptions.plans
		.read(dbmage.findAll(planIds, planId => ({planId})))

	return {
		tierRows,
		planRows,
	}
}

export async function revokeUserRoles({
		userId, database, tierRows, planRows,
	}: {
		userId: dbmage.Id
		database: DatabaseSafe
		tierRows: SubscriptionTierRow[]
		planRows: SubscriptionPlanRow[]
	}) {

	const roleIds = [
		...tierRows.map(row => row.roleId),
		...planRows.map(row => row.roleId),
	]

	if (roleIds.length > 0) {
		await database.tables.auth.permissions.userHasRole.delete({
			conditions: dbmage.and(
				{equal: {userId}},
				dbmage.or(
					...roleIds.map(roleId => ({equal: {roleId}}))
				),
			),
		})
	}
}

export async function grantUserRoles({
		timeframeEnd,
		timeframeStart,
		tierRows,
		planRows,
		userId,
		database,
	}: {
		timeframeEnd: number
		timeframeStart: number
		tierRows: SubscriptionTierRow[]
		planRows: SubscriptionPlanRow[]
		userId: dbmage.Id
		database: DatabaseSafe
	}) {

	debugger

	await database.transaction(async({tables, abort}) => {
		await Promise.all([
			...planRows.map(async planRow => {
				await tables.auth.permissions.userHasRole.update({
					...dbmage.find({userId, roleId: planRow.roleId}),
					upsert: {
						userId,
						hard: true,
						public: true,
						time: Date.now(),
						roleId: planRow.roleId,
						timeframeStart,
						timeframeEnd,
					},
				})
			}),
			...tierRows.map(async tierRow => {
				await tables.auth.permissions.userHasRole.update({
					...dbmage.find({userId, roleId: tierRow.roleId}),
					upsert: {
						userId,
						hard: true,
						public: true,
						time: Date.now(),
						roleId: tierRow.roleId,
						timeframeStart,
						timeframeEnd,
					},
				})
			})
		])
	})
}
