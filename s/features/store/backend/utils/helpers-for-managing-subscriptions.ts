
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreConnectedAuth} from "../policies/types.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {RoleManager} from "../../../auth/aspects/permissions/interactions/types.js"
import {SubscriptionPlanDraft, SubscriptionPricingDraft} from "../services/subscriptions/types/drafts.js"

export const helpersForManagingSubscriptions = ({
		connectId,
		storeDatabase,
		stripeLiaisonAccount,
		roleManager,
		generateId,
	}: StoreConnectedAuth & {
		roleManager: RoleManager
		generateId: () => dbmage.Id
	}) => {

	const storeTables = storeDatabase.tables

	async function createStripeProductAndPriceResources({productLabel, pricing}: {
			productLabel: string
			pricing: SubscriptionPricingDraft
		}) {

		const {id: stripeProductId} =
			await stripeLiaisonAccount
				.products
				.create({name: productLabel})

		const {id: stripePriceId} =
			await stripeLiaisonAccount
				.prices
				.create({
					active: true,
					product: stripeProductId,
					currency: pricing.currency,
					unit_amount: pricing.price,
					recurring: {interval: pricing.interval},
				})

		await stripeLiaisonAccount
			.products
			.update(stripeProductId, {default_price: stripePriceId})

		return {stripeProductId, stripePriceId}
	}

	return {

		async createPlanAndTier({planLabel, tier}: SubscriptionPlanDraft) {
			const planId = generateId()
			const tierId = generateId()

			const {roleId} = await roleManager
				.createPrivateSystemRole({
					label: tier.label,
				})

			await storeTables
				.subscriptions
				.plans
				.create({
					connectId,
					planId,
					label: planLabel,
					time: Date.now(),
					archived: false,
				})

			const {stripeProductId, stripePriceId} =
				await createStripeProductAndPriceResources({
					productLabel: tier.label,
					pricing: tier.pricing,
				})

			await storeTables
				.subscriptions
				.tiers
				.create({
					connectId,
					tierId,
					planId,
					label: tier.label,
					roleId,
					time: Date.now(),
					stripeProductId,
				})

			return {
				planId,
				tierId,
				stripePriceId,
				tierRoleId: roleId,
				time: Date.now(),
			}
		},

		async createTierForPlan({planId, label, pricing}: {
				planId: string
				label: string
				pricing: SubscriptionPricingDraft
			}) {

			const planRow = await storeTables
				.subscriptions
				.plans
				.readOne(
					dbmage.find({planId: dbmage.Id.fromString(planId)})
				)

			if (!planRow)
				throw new Error(`unknown subscription plan ${planId}`)

			const {stripeProductId, stripePriceId} =
				await createStripeProductAndPriceResources({
					productLabel: label,
					pricing,
				})

			const {roleId} = await roleManager.createPrivateSystemRole({label})

			const time = Date.now()
			const tierId = generateId()

			await storeTables
				.subscriptions
				.tiers
				.create({
					connectId,
					time,
					label,
					tierId,
					roleId,
					stripeProductId,
					planId: planRow.planId,
				})

			return {tierId, roleId, time, stripePriceId}
		},

		async updatePlan({planId: planIdString, label, archived}: {
				planId: string
				label: string
				archived: boolean
			}) {
			const planId = dbmage.Id.fromString(planIdString)
			const planRow = await storeTables
				.subscriptions
				.plans
				.readOne(dbmage.find({planId}))

			if (!planRow)
				throw new renraku.ApiError(400, `unable to find plan ${planIdString}`)

			await storeTables
				.subscriptions
				.plans
				.update({
					...dbmage.find({planId}),
					write: {label, archived},
				})
		},

		async updateTier({tierId: tierIdString, label, active, pricing}: {
				tierId: string
				label: string
				active: boolean
				pricing: SubscriptionPricingDraft
			}) {

			const tierId = dbmage.Id.fromString(tierIdString)
			const tierRow = await storeTables
				.subscriptions
				.tiers
				.readOne(dbmage.find({tierId}))

			if (!tierRow)
				throw new renraku.ApiError(400, `tier not found ${tierIdString}`)

			const roleRow = await roleManager.readRole(tierRow.roleId)
			if (!roleRow)
				throw new renraku.ApiError(400, `role not found ${tierRow.roleId.string}`)

			let {stripeProductId} = tierRow
			const stripeProduct = await stripeLiaisonAccount
				.products
				.retrieve(stripeProductId)

			let stripePriceId = getStripeId(stripeProduct.default_price)

			const stripePrice = await stripeLiaisonAccount
				.prices
				.retrieve(stripePriceId)

			if (!stripePrice)
				throw new renraku.ApiError(500, `stripe price not found ${stripePriceId}`)

			if (!stripeProduct)
				throw new renraku.ApiError(500, `stripe product not found ${stripeProductId}`)

			const isPricingDifferent =
				pricing.price !== stripePrice.unit_amount ||
				pricing.currency !== stripePrice.currency ||
				pricing.interval !== stripePrice.recurring.interval

			if (isPricingDifferent) {
				const newStripePrice = await stripeLiaisonAccount
					.prices
					.create({
						active,
						product: stripeProductId,
						currency: pricing.currency,
						unit_amount: pricing.price,
						recurring: {interval: pricing.interval},
					})
				stripePriceId = newStripePrice.id
				await stripeLiaisonAccount
					.products
					.update(stripeProductId, {default_price: stripePriceId})
			}
			else if (active !== stripePrice.active)
				await stripeLiaisonAccount
					.prices
					.update(stripePrice.id, {active})

			await roleManager.updateRole({
				label,
				roleId: tierRow.roleId,
			})
		},
	}
}
