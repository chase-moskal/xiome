
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {PlanningSituation} from "./types/planning-situation.js"
import {loading} from "../../../../framework/loading/loading.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {makeEcommerceModel} from "../ecommerce-model/ecommerce-model.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {isAllowedToPlanSubscriptions} from "./helpers/is-allowed-to-plan-subscriptions.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"

export function subscriptionPlanningModel({
			shopkeepingService,
			ecommerceModel,
		}: {
		shopkeepingService: Service<typeof shopkeepingTopic>
		ecommerceModel: ReturnType<typeof makeEcommerceModel>
	}) {

	const state = mobxify({
		situation: <PlanningSituation.Any>{
			mode: PlanningSituation.Mode.LoggedOut,
		},
		setSituation(situation: PlanningSituation.Any) {
			state.situation = situation
		},
	})

	let isActiveInDom = false

	const loadPlans = onesie(async function() {
		await ecommerceModel.initialize()
		if (state.situation.mode === PlanningSituation.Mode.Privileged) {
			await state.situation.loadingPlans.actions.setLoadingUntil({
				errorReason: "failed to load subscription plans",
				promise: shopkeepingService.listSubscriptionPlans(),
			})
		}
	})

	function createLoadingThatStartsReady() {
		const load = loading<void>()
		load.actions.setReady()
		return load
	}

	function requirePrivilegedSituation() {
		if (state.situation.mode !== PlanningSituation.Mode.Privileged)
			throw new Error("not privileged for subscription planning")
		return state.situation
	}

	return {

		async requestToStartLoadingPlans() {
			isActiveInDom = true
			await loadPlans()
		},

		async accessChange(access: AccessPayload) {
			const storeStatus = ecommerceModel.loadingViews.storeStatus.payload
			const storeInitialized =
				storeStatus !== undefined && storeStatus !== StoreStatus.Uninitialized
			console.log(storeStatus, storeInitialized)
			state.setSituation(
				storeInitialized
					? access
						? isAllowedToPlanSubscriptions(access)
							? {
								mode: PlanningSituation.Mode.Privileged,
								loadingPlans: loading(),
								loadingPlanCreation: createLoadingThatStartsReady(),
							}
							: {mode: PlanningSituation.Mode.Unprivileged}
						: {mode: PlanningSituation.Mode.LoggedOut}
					: {mode: PlanningSituation.Mode.StoreUninitialized}
			)
			if (isActiveInDom)
				await loadPlans()
		},

		getSituationMode() {
			return state.situation.mode
		},

		getLoadingViews() {
			const situation = requirePrivilegedSituation()
			return {
				loadingPlans: situation.loadingPlans.view,
				loadingPlanCreation: situation.loadingPlanCreation.view,
			}
		},

		async createPlan(draft: SubscriptionPlanDraft) {
			const situation = requirePrivilegedSituation()
			async function action() {
				const plan = await shopkeepingService.createSubscriptionPlan({draft})
				const existingPlans = situation.loadingPlans.view.payload
				const newPlans = [...existingPlans, plan]
				situation.loadingPlans.actions.setReady(newPlans)
			}
			return situation.loadingPlanCreation.actions.setLoadingUntil({
				errorReason: "error creating subscription plan",
				promise: action(),
			})
		},

		async deactivatePlan(subscriptionPlanId: string) {
			const situation = requirePrivilegedSituation()
			return situation.loadingPlans.actions.setLoadingUntil({
				errorReason: "error occurred",
				promise: shopkeepingService
					.deactivateSubscriptionPlan({subscriptionPlanId})
					.then(shopkeepingService.listSubscriptionPlans)
			})
		},

		async deletePlan(subscriptionPlanId: string) {
			const situation = requirePrivilegedSituation()
			return situation.loadingPlans.actions.setLoadingUntil({
				errorReason: "error occurred",
				promise: shopkeepingService
					.deleteSubscriptionPlan({subscriptionPlanId})
					.then(shopkeepingService.listSubscriptionPlans)
			})
		}
	}
}
