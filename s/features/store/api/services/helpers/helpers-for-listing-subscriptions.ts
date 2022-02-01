
import * as dbmage from "dbmage"
import {Id, find, findAll} from "dbmage"

import {SubscriptionPlan} from "../../../types/store-concepts.js"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
import {stripeAttempt} from "../../../stripe/liaison/helpers/stripe-attempt.js"
import {SubscriptionPlanRow, SubscriptionTierRow} from "../../../types/store-schema.js"

export const helpersForListingSubscriptions = ({
		database, stripeAccountId, stripeLiaisonAccount,
	}: StoreLinkedAuth) => {
	const storeTables = database.tables.store
	return ({

		async fetchOurSubscriptionPlanRecords() {
			return storeTables.subscriptions.plans.read(find({stripeAccountId}))
		},

		async crossReferencePlansWithStripeProducts(planRows: SubscriptionPlanRow[]) {
			return crossReferenceWithStripe({
				rows: planRows,
				getRowId: row => row.planId,
				getStripeResource: row => stripeLiaisonAccount.products.retrieve(row.stripeProductId),
			})
		},

		async deletePlans(planIds: Id[]) {
			if (planIds.length)
				await storeTables.subscriptions.plans.delete(
					findAll(planIds, planId => ({planId, stripeAccountId}))
				)
		},

		async fetchOurRecordsOfPlanTiers(
					planIds: Id[]
				): Promise<SubscriptionTierRow[]> {
			return planIds.length
				? storeTables.subscriptions.tiers.read(
					findAll(planIds, planId => ({planId, stripeAccountId}))
				)
				: []
		},

		async crossReferenceTiersWithStripePrices(tierRows: SubscriptionTierRow[]) {
			return crossReferenceWithStripe({
				rows: tierRows,
				getRowId: row => row.tierId,
				getStripeResource: row => stripeLiaisonAccount.products.retrieve(row.stripePriceId),
			})
		},

		async deleteTiers(tierIds: Id[]) {
			if (tierIds.length) {
				await storeTables.subscriptions.tiers.delete(
					findAll(tierIds, tierId => ({tierId, stripeAccountId}))
				)
			}
		},

		identifyTiersWithoutParentPlan(
				tierRows: SubscriptionTierRow[],
				presentPlanIds: Id[],
			) {
			const stringPresentPlanIds = presentPlanIds.map(p => p.toString())
			return tierRows
				.filter(row => stringPresentPlanIds.includes(row.planId.toString()))
				.map(row => row.tierId)
		},

		dedupeIds(ids: Id[]) {
			const stringIds = ids.map(id => id.toString())
			const deduped = [...new Set(stringIds)]
			return deduped.map(id => Id.fromString(id))
		},

		async deleteTiersWithoutParentPlan(tierIds: Id[]) {
			if (tierIds.length) {
				await storeTables.subscriptions.tiers.delete(
					findAll(tierIds, tierId => ({tierId, stripeAccountId}))
				)
			}
		},

		assembleSubscriptionPlans({plans, tiers}: {
					plans: {
						rows: SubscriptionPlanRow[]
						cross: StripeCrossReference
					},
					tiers: {
						rows: SubscriptionTierRow[]
						cross: StripeCrossReference
					}
				}): SubscriptionPlan[] {

			const presentPlanRows = plans.rows
				.filter(({planId}) => plans.cross.presentIds.includes(planId))

			const presentTierRows = tiers.rows
				.filter(({tierId}) => tiers.cross.presentIds.includes(tierId))

			return presentPlanRows.map(row => ({
				time: row.time,
				label: row.label,
				planId: row.planId.toString(),
				active: plans.cross.activeIds.includes(row.planId),
				tiers: presentTierRows
					.filter(
						({planId}) => {
							
						}
					)
					.map(p => undefined),
			}))
		},
	})
}

export type BasicStripeResource = undefined | {active: boolean}

export interface StripeCrossReference {
	missingIds: Id[]
	presentIds: Id[]
	activeIds: Id[]
}

async function crossReferenceWithStripe<
			xRow extends dbmage.Row,
			xStripeResource extends BasicStripeResource
		>({rows, getRowId, getStripeResource}: {
			rows: xRow[]
			getRowId(row: xRow): Id
			getStripeResource(row: xRow): Promise<xStripeResource>
		}) {
	const rowsWithStripeResources = await Promise.all(
		rows.map(async row => ({
			row,
			stripeResource: await stripeAttempt(() => getStripeResource(row)),
		}))
	)
	return discriminateMissingPresentAndActive(
		rowsWithStripeResources.map(c => ({
			id: getRowId(c.row),
			stripeResource: c.stripeResource,
		}))
	)
}

function discriminateMissingPresentAndActive(
		manifest: {
			stripeResource: BasicStripeResource,
			id: Id,
		}[]
	): StripeCrossReference {

	const missingIds: Id[] = []
	const presentIds: Id[] = []
	const activeIds: Id[] = []

	for (const {stripeResource, id} of manifest) {
		if (stripeResource === undefined)
			missingIds.push(id)
		else {
			presentIds.push(id)
			if (stripeResource.active)
				activeIds.push(id)
		}
	}

	return {missingIds, presentIds, activeIds}
}
