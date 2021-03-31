
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {loading} from "../../../../framework/loading/loading.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {SubscriptionPlan} from "../../topics/types/subscription-plan.js"
import {makeEcommerceModel} from "../ecommerce-model/ecommerce-model.js"
import {modelDataInitializationWidget} from "../../../../framework/model-helpers/model-data-initialization-widget.js"

export function subscriptionPlanningModel({shopkeepingService, ecommerceModel}: {
		shopkeepingService: Service<typeof shopkeepingTopic>
		ecommerceModel: ReturnType<typeof makeEcommerceModel>
	}) {

	const state = mobxify({
		subscriptionPlanLoading: loading<SubscriptionPlan[]>(),
	})

	const load = onesie(async() => {
		const storeStatus = await ecommerceModel.fetchStoreStatus()
		if (storeStatus)
			await state.subscriptionPlanLoading.actions.setLoadingUntil({
				promise: shopkeepingService.listSubscriptionPlans(),
				errorReason: "failed to load subscription plans",
			})
		else
			state.subscriptionPlanLoading.actions.setNone()
	})

	const {indicateDomUsage, accessChange} = modelDataInitializationWidget({
		load,
		reset: () => state.subscriptionPlanLoading.actions.setNone(),
	})

	return {
		accessChange,
		indicateDomUsage,
		get subscriptionPlanLoadingView() {
			return state.subscriptionPlanLoading.view
		},
	}
}
