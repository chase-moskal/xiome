
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {makeStripeLiaison} from "../../liaison/stripe-liaison.js"
import {stripeClientReferenceId} from "../../../api/utils/stripe-client-reference-id.js"
import {DatabaseRaw, DatabaseSafe, DatabaseSchema} from "../../../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"
import {StripeLiaison} from "../../../types/store-concepts.js"
import {dedupe} from "../../../../../toolbox/dedupe.js"
import {SubscriptionPlanRow, SubscriptionTierRow} from "../../../types/store-schema.js"

export function webhookHelpers(
		stripeLiaisonAccount: ReturnType<ReturnType<typeof makeStripeLiaison>["account"]>
	) {
	return {

		async getStripeSubscription(
				s: string | Stripe.Subscription
			): Promise<Stripe.Subscription> {
			return s === typeof "string"
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

	await database.transaction(async({tables, abort}) => {
		await Promise.all([
			...planRows.map(async planRow => {
				await database.tables.auth.permissions.userHasRole.update({
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
				await database.tables.auth.permissions.userHasRole.update({
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
