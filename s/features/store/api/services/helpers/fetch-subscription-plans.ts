
import * as dbmage from "dbmage"

import {SubscriptionPlan} from "../../../types/store-concepts.js"
import {SubscriptionTierRow} from "../../../types/store-schema.js"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
import {stripeAttempt} from "../../../stripe/liaison/helpers/stripe-attempt.js"

export async function fetchSubscriptionPlans(
		auth: StoreLinkedAuth
	): Promise<SubscriptionPlan[]> {

	const helpers = setupHelpers(auth)
	const storeTables = auth.database.tables.store

	const {planRows, tierRows} =
		await helpers.fetchOurRecordsOfSubscriptionPlansAndTiers()

	const plansCrossed = await helpers.cleanse({
		crossed: await crossReferenceWithStripe({
			rows: planRows,
			getStripeResource: async row =>
				auth.stripeLiaisonAccount.products.retrieve(row.stripeProductId),
		}),
		getIdFromRow: row => row.planId,
		deleteMissing: ids => storeTables.subscriptions.plans
			.delete(dbmage.findAll(ids, id => ({planId: id}))),
	})

	const tiersCrossed = await helpers.cleanse({
		crossed: await crossReferenceWithStripe({
			rows: tierRows,
			getStripeResource: async row =>
				auth.stripeLiaisonAccount.prices.retrieve(row.stripePriceId),
		}),
		getIdFromRow: row => row.tierId,
		deleteMissing: ids => storeTables.subscriptions.tiers
			.delete(dbmage.findAll(ids, id => ({tierId: id}))),
	})

	await helpers.deleteTiersWithoutParentPlans({
		planIds: plansCrossed.map(cross => cross.row.planId),
		tierRows: tiersCrossed.map(cross => cross.row),
	})

	return plansCrossed.map(planCross => {
		return {
			active: planCross.status === StripeResourceStatus.Active,
			label: planCross.row.label,
			planId: planCross.row.planId.string,
			time: planCross.row.time,
			tiers: tiersCrossed
				.filter(cross => cross.row.planId.equals(planCross.row.planId))
				.map(cross => ({
					tierId: cross.row.tierId.string,
					label: cross.row.label,
					price: cross.stripeResource.unit_amount,
					time: cross.row.time,
					active: cross.status === StripeResourceStatus.Active,
				})),
		}
	})
}

function setupHelpers({database, stripeAccountId}: StoreLinkedAuth) {
	const storeTables = database.tables.store
	return {

		async fetchOurRecordsOfSubscriptionPlansAndTiers() {
			const planRows = await storeTables.subscriptions.plans
				.read(dbmage.find({stripeAccountId}))
			const planIds = planRows.map(row => row.planId)
			const tierRows = planIds.length
				? await storeTables.subscriptions.tiers
					.read(dbmage.findAll(planIds, planId => ({planId})))
				: []
			return {planRows, tierRows}
		},

		async cleanse<xRow extends dbmage.Row, xResource extends BasicStripeResource>({
				crossed, getIdFromRow, deleteMissing,
			}: {
				crossed: CrossReference<xRow, xResource>[]
				getIdFromRow: (row: xRow) => dbmage.Id
				deleteMissing: (ids: dbmage.Id[]) => Promise<void>
			}) {
			const idsMissingFromStripe = crossed
				.filter(({status}) => status === StripeResourceStatus.Missing)
				.map(({row}) => getIdFromRow(row))
			if (idsMissingFromStripe.length)
				await deleteMissing(idsMissingFromStripe)
			return crossed
				.filter(({status}) => status !== StripeResourceStatus.Missing)
		},

		async deleteTiersWithoutParentPlans({planIds, tierRows}: {
				planIds: dbmage.Id[]
				tierRows: SubscriptionTierRow[]
			}) {
			const planIdStrings = planIds.map(id => id.string)
			const tierIdsWithoutParentPlans = tierRows
				.filter(row => !planIdStrings.includes(row.planId.string))
				.map(row => row.tierId)
			if (tierIdsWithoutParentPlans.length)
				await storeTables.subscriptions.tiers
					.delete(dbmage.findAll(tierIdsWithoutParentPlans, tierId => ({tierId})))
		},
	}
}

type BasicStripeResource = undefined | {active: boolean}

enum StripeResourceStatus {
	Missing,
	Active,
	Inactive,
}

interface CrossReference<xRow extends dbmage.Row, xStripeResource extends BasicStripeResource> {
	row: xRow
	stripeResource: xStripeResource
	status: StripeResourceStatus
}

async function crossReferenceWithStripe<
		xRow extends dbmage.Row,
		xStripeResource extends BasicStripeResource
	>({rows, getStripeResource}: {
		rows: xRow[]
		getStripeResource(row: xRow): Promise<xStripeResource>
	}): Promise<CrossReference<xRow, xStripeResource>[]> {
	return Promise.all(
		rows.map(async row => {
			const stripeResource = await stripeAttempt(() => getStripeResource(row))
			return {
				row,
				stripeResource,
				status: (
					stripeResource === undefined
						? StripeResourceStatus.Missing
						: stripeResource.active
							? StripeResourceStatus.Active
							: StripeResourceStatus.Inactive
				),
			}
		})
	)
}
