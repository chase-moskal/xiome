
import * as dbmage from "dbmage"

import {StoreConnectedAuth} from "../policies/types.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"
import {SubscriptionPlan, SubscriptionPricing} from "../../isomorphic/concepts.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {stripeAttempt} from "../stripe/liaison/helpers/stripe-attempt.js"
import Stripe from "stripe"

// TODO all of the logic in this function is questionable,
// and should probably be rewritten.
export async function fetchSubscriptionPlans(
		auth: StoreConnectedAuth
	): Promise<SubscriptionPlan[]> {

	const helpers = setupHelpers(auth)
	const {stripeLiaisonAccount, roleManager} = auth
	const storeTables = auth.storeDatabase.tables

	const {planRows, tierRows} = await helpers
		.fetchOurRecordsOfSubscriptionPlansAndTiers()

	const tiersCrossed = await helpers.cleanse({
		crossed: await crossReferenceWithStripe({
			rows: tierRows,
			getStripeResource: async row => {
				const stripeProduct = await stripeLiaisonAccount
					.products
					.retrieve(row.stripeProductId)
				const stripePriceId = getStripeId(stripeProduct.default_price)
				const stripePrice = !!stripePriceId 
					? await stripeLiaisonAccount.prices
						.retrieve(stripePriceId)
					: undefined
				const {active} = stripeProduct

				return {active, stripePrice}
			},
		}),
		getIdFromRow: row => row.tierId,
		getRoleIdFromRow: row => row.roleId,
		deleteMissing: ids => (
			storeTables
				.subscriptions
				.tiers
				.delete(dbmage.findAll(ids, id => ({tierId: id})))
		),
		deleteAssociatedRoles: async roleIds => (
			roleIds.forEach(async id => (
				await roleManager.deleteRole(id)
			))
		)
	})

	await helpers.deleteTiersWithoutParentPlans({
		planIds: planRows.map(row => row.planId),
		tierRows: tiersCrossed.map(cross => cross.row),
	})

	return planRows
		.map(row => ({
			archived: row.archived ?? false,
			label: row.label,
			planId: row.planId.string,
			time: row.time,
			tiers: tiersCrossed
				.filter(cross => cross.row.planId.equals(row.planId))
				.map(cross => ({
					tierId: cross.row.tierId.string,
					roleId: cross.row.roleId.string,
					label: cross.row.label,
					time: cross.row.time,
					active: cross.status === StripeResourceStatus.Active,
					pricing: cross.stripeResource.stripePrice && [{
						stripePriceId: cross.stripeResource.stripePrice.id,
						price: cross.stripeResource.stripePrice.unit_amount,
						currency: cross.stripeResource.stripePrice.currency as SubscriptionPricing["currency"],
						interval: cross.stripeResource.stripePrice.recurring.interval as SubscriptionPricing["interval"]
					}],
				}))
				.sort((tierA, tierB) => tierA.pricing[0].price - tierB.pricing[0].price),
		}))
		.sort((planA, planB) => planA.time - planB.time)
}

function setupHelpers({storeDatabase}: StoreConnectedAuth) {
	const storeTables = storeDatabase.tables
	return {

		async fetchOurRecordsOfSubscriptionPlansAndTiers() {
			const planRows = await storeTables
				.subscriptions
				.plans
				.read({conditions: false})

			const planIds = planRows.map(row => row.planId)

			const tierRows = planIds.length
				? await storeTables
					.subscriptions
					.tiers
					.read(dbmage.findAll(planIds, planId => ({planId})))
				: []

			return {planRows, tierRows}
		},

		async cleanse<xRow extends dbmage.Row, xResource extends BasicStripeResource>({
				crossed, getIdFromRow, getRoleIdFromRow,
				deleteMissing, deleteAssociatedRoles
			}: {
				crossed: CrossReference<xRow, xResource>[]
				getIdFromRow: (row: xRow) => dbmage.Id
				getRoleIdFromRow: (row: xRow) => dbmage.Id
				deleteMissing: (ids: dbmage.Id[]) => Promise<void>
				deleteAssociatedRoles: (roleIds: dbmage.Id[]) => Promise<void>
			}) {

			const missingTiers = crossed
				.filter(({status}) => status === StripeResourceStatus.Missing)

			const idsMissingFromStripe = missingTiers
				.map(({row}) => getIdFromRow(row))

			const roleIdsForMissingTiers = missingTiers
				.map(({row}) => getRoleIdFromRow(row))

			if (idsMissingFromStripe.length) {
				await deleteMissing(idsMissingFromStripe)
				await deleteAssociatedRoles(roleIdsForMissingTiers)
			}

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
				await storeTables
					.subscriptions
					.tiers
					.delete(dbmage.findAll(
						tierIdsWithoutParentPlans,
						tierId => ({tierId})
					))
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
					(stripeResource === undefined || stripeResource === null)
						? StripeResourceStatus.Missing
						: stripeResource.active
							? StripeResourceStatus.Active
							: StripeResourceStatus.Inactive
				),
			}
		})
	)
}
