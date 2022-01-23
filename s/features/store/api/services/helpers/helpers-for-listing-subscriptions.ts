
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {DbbyRow} from "../../../../../toolbox/dbby/dbby-types.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {stripeAttempt} from "../../../stripe/liaison/helpers/stripe-attempt.js"
import {StripeLiaisonAccount, SubscriptionPlan} from "../../../types/store-concepts.js"
import {StoreSchema, SubscriptionPlanRow, SubscriptionTierRow} from "../../../types/store-schema.js"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"

export const helpersForListingSubscriptions = ({
		storeTables, stripeAccountId, stripeLiaisonAccount,
	}: StoreLinkedAuth) => ({

	async fetchOurSubscriptionPlanRecords() {
		return storeTables.subscription.plans.read(find({stripeAccountId}))
	},

	async crossReferencePlansWithStripeProducts(planRows: SubscriptionPlanRow[]) {
		return crossReferenceWithStripe({
			rows: planRows,
			getRowId: row => row.planId,
			getStripeResource: row => stripeLiaisonAccount.products.retrieve(row.stripeProductId),
		})
	},

	async deletePlans(planIds: DamnId[]) {
		if (planIds.length)
			await storeTables.subscription.plans.delete(
				findAll(planIds, planId => ({planId, stripeAccountId}))
			)
	},

	async fetchOurRecordsOfPlanTiers(
				planIds: DamnId[]
			): Promise<SubscriptionTierRow[]> {
		return planIds.length
			? storeTables.subscription.tiers.read(
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

	async deleteTiers(tierIds: DamnId[]) {
		if (tierIds.length) {
			await storeTables.subscription.tiers.delete(
				findAll(tierIds, tierId => ({tierId, stripeAccountId}))
			)
		}
	},

	identifyTiersWithoutParentPlan(
			tierRows: SubscriptionTierRow[],
			presentPlanIds: DamnId[],
		) {
		const stringPresentPlanIds = presentPlanIds.map(p => p.toString())
		return tierRows
			.filter(row => stringPresentPlanIds.includes(row.planId.toString()))
			.map(row => row.tierId)
	},

	dedupeIds(ids: DamnId[]) {
		const stringIds = ids.map(id => id.toString())
		const deduped = [...new Set(stringIds)]
		return deduped.map(id => DamnId.fromString(id))
	},

	async deleteTiersWithoutParentPlan(tierIds: DamnId[]) {
		if (tierIds.length) {
			await storeTables.subscription.tiers.delete(
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

export type BasicStripeResource = undefined | {active: boolean}

export interface StripeCrossReference {
	missingIds: DamnId[]
	presentIds: DamnId[]
	activeIds: DamnId[]
}

async function crossReferenceWithStripe<
			xRow extends DbbyRow,
			xStripeResource extends BasicStripeResource
		>({rows, getRowId, getStripeResource}: {
			rows: xRow[]
			getRowId(row: xRow): DamnId
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
			id: DamnId,
		}[]
	): StripeCrossReference {

	const missingIds: DamnId[] = []
	const presentIds: DamnId[] = []
	const activeIds: DamnId[] = []

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
