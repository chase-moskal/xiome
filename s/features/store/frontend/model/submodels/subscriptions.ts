
import {objectMap, unproxy} from "@chasemoskal/snapstate"

import {StoreServices} from "../../types.js"
import {StoreStateSystem} from "../../state.js"
import {ops} from "../../../../../framework/ops.js"
import {StripePopups} from "../../../popups/types.js"
import {SubscriptionTier} from "../../../isomorphic/concepts.js"
import {SubscriptionTierDraft, SubscriptionPricingDraft} from "../../../backend/services/subscriptions/types/drafts.js"

export function makeSubscriptionsSubmodel({
		services,
		stateSystem,
		stripePopups,
		reauthorize,
	}: {
		services: StoreServices
		stateSystem: StoreStateSystem
		stripePopups: StripePopups
		reauthorize: () => Promise<void>
	}) {

	const state = stateSystem.snap.writable
	const {get} = stateSystem

	async function load() {

		state
			.subscriptions
			.subscriptionPlansOp = ops.none()

		state
			.subscriptions
			.mySubscriptionDetailsOp = ops.none()

		if (get.is.storeActive) {
			await ops.operation({
				setOp: op => state
					.subscriptions
					.subscriptionPlansOp = op,
				promise: services
					.subscriptions
					.listing
					.listPlans(),
			})

			if (get.is.userLoggedIn) {
				await ops.operation({
					setOp: op => state
						.subscriptions
						.mySubscriptionDetailsOp = op,
					promise: services
						.subscriptions
						.shopping
						.fetchDetailsAboutMySubscriptions(),
				})
			}
		}
	}

	const actions = {

		async purchase({stripePriceId, showLoadingSpinner}: {
				stripePriceId: string
				showLoadingSpinner?: boolean
			}) {

			if (showLoadingSpinner)
				state
					.subscriptions
					.mySubscriptionDetailsOp = ops.loading()

			const {checkoutDetails} = await services
				.subscriptions
				.shopping
				.buy(stripePriceId)

			if (checkoutDetails)
				await stripePopups.checkoutSubscription(checkoutDetails)
		},

		async cancel(tierId: string) {
			state
				.subscriptions
				.mySubscriptionDetailsOp = ops.loading()
			await services
				.subscriptions
				.shopping
				.cancel(tierId)
		},

		async uncancel(tierId: string) {
			state
				.subscriptions
				.mySubscriptionDetailsOp = ops.loading()
			await services
				.subscriptions
				.shopping
				.uncancel(tierId)
		},
	}

	const reauthorizeAndRefreshAfter = <typeof actions>objectMap(
		actions,
		fun => async(...args: any[]) => {
			await fun(...args)
			await reauthorize()
		},
	)

	function getPlans() {
		return ops.value(unproxy(state.subscriptions.subscriptionPlansOp))
			?? []
	}

	return {
		load,

		...reauthorizeAndRefreshAfter,

		async addPlan(options: {
				planLabel: string
				tier: SubscriptionTierDraft
			}) {

			const newPlan = await services
				.subscriptions
				.planning
				.addPlan(options)

			const oldPlans = getPlans()

			state
				.subscriptions
				.subscriptionPlansOp = ops.replaceValue(
					state.subscriptions.subscriptionPlansOp,
					[...oldPlans, newPlan],
				)

			return newPlan
		},

		async addTier(options: {
				label: string
				planId: string
				pricing: SubscriptionPricingDraft
			}) {

			const plans = getPlans()

			const tier = await services
				.subscriptions
				.planning
				.addTier(options)

			const plan = plans.find(plan => plan.planId === options.planId)
			plan.tiers = [...plan.tiers, tier]

			state
				.subscriptions
				.subscriptionPlansOp = ops.ready(plans)

			return tier
		},

		async editPlan({planId, label, archived}: {
				planId: string
				label: string
				archived: boolean
			}) {

			await services
				.subscriptions
				.planning
				.editPlan({planId, label, archived})

			const plans = getPlans()

			const plan = plans.find(plan => plan.planId === planId)
			plan.label = label
			plan.archived = archived

			state
				.subscriptions
				.subscriptionPlansOp = ops.ready(plans)
		},

		async editTier({
				planId,
				tierId,
				label,
				active,
				pricing
			}: {
				planId: string
				tierId: string
				label: string
				active: boolean
				pricing: SubscriptionPricingDraft
			}) {

			const newTier = await services
				.subscriptions
				.planning
				.editTier({
					tierId,
					active,
					label,
					pricing,
				})

			const plans = getPlans()
			const plan = plans.find(plan => plan.planId === planId)

			plan.tiers = plan.tiers.map(
				function swapTierInPlace(existingTier: SubscriptionTier) {
					const isEditedTier = (existingTier.tierId === newTier.tierId)
					return isEditedTier
						? newTier
						: existingTier
				}
			)

			state
				.subscriptions
				.subscriptionPlansOp = ops.ready(plans)
		},
	}
}
