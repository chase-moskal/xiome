
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

export function subscriptionPlanningModel({
			shopkeepingService,
			ecommerceModel,
		}: {
		shopkeepingService: Service<typeof shopkeepingTopic>
		ecommerceModel: ReturnType<typeof makeEcommerceModel>
	}) {

	const state2 = mobxify({
		situation: <PlanningSituation.Any>{
			mode: PlanningSituation.Mode.LoggedOut,
		},
		setSituation(situation: PlanningSituation.Any) {
			state2.situation = situation
		},
	})

	let activeInDom = false

	const load = onesie(async function() {
		if (state2.situation.mode === PlanningSituation.Mode.Privileged) {
			const storeStatus = await ecommerceModel.fetchStoreStatus()
			if (storeStatus)
				await state2.situation.loadingSubscriptionPlans.actions.setLoadingUntil({
					errorReason: "failed to load subscription plans",
					promise: shopkeepingService.listSubscriptionPlans(),
				})
			else
				state2.situation.loadingSubscriptionPlans.actions.setNone()
		}
	})

	async function indicateComponentInitialization() {
		activeInDom = true
		await load()
	}

	async function accessChange(access: AccessPayload) {
		const storeStatus = await ecommerceModel.fetchStoreStatus()
		const storeInitialized = storeStatus !== StoreStatus.Uninitialized
		state2.setSituation(
			storeInitialized
			? access
				? isAllowedToPlanSubscriptions(access)
					? {
						mode: PlanningSituation.Mode.Privileged,
						loadingSubscriptionPlans: loading(),
					}
					: {mode: PlanningSituation.Mode.Unprivileged}
				: {mode: PlanningSituation.Mode.LoggedOut}
			: {mode: PlanningSituation.Mode.StoreUninitialized}
		)
		if (activeInDom)
			await load()
	}

	return {
		accessChange,
		indicateComponentInitialization,
		getSituationMode() {
			return state2.situation.mode
		},
		getLoadingViewForSubscriptionPlans() {
			return (<PlanningSituation.Privileged>state2.situation)
				.loadingSubscriptionPlans.view
		},
		// getLoadingViewForSubscriptionPlans() {
		// 	if (state2.situation.mode !== SubscriptionSituation.Mode.Privileged)
		// 		throw new Error("cannot get situation planner loading view outside privileged mode")
		// 	return state2.situation.loadingSubscriptionPlans.view
		// },
	}

	// const state = mobxify({
	// 	subscriptionPlanLoading: loading<SubscriptionPlan[]>(),
	// })

	// const load = onesie(async() => {
	// 	const storeStatus = await ecommerceModel.fetchStoreStatus()
	// 	if (storeStatus)
	// 		await state.subscriptionPlanLoading.actions.setLoadingUntil({
	// 			promise: shopkeepingService.listSubscriptionPlans(),
	// 			errorReason: "failed to load subscription plans",
	// 		})
	// 	else
	// 		state.subscriptionPlanLoading.actions.setNone()
	// })

	// /*

	// access: none
	// 	{mode: None}

	// */

	// const {indicateDomUsage, accessChange} = modelDataInitializationWidget({
	// 	load,
	// 	reset: () => state.subscriptionPlanLoading.actions.setNone(),
	// })

	// return {
	// 	accessChange,
	// 	indicateDomUsage,
	// 	get subscriptionPlanLoadingView() {
	// 		return state.subscriptionPlanLoading.view
	// 	},
	// }
}
