
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {loading} from "../../../../framework/loading/loading.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {SubscriptionPlan} from "../../topics/types/subscription-plan.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"
import {modelDataInitializationWidget} from "../../../../framework/model-helpers/model-data-initialization-widget.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"

export function subscriptionPlanningModel({shopkeepingService}: {
		shopkeepingService: Service<typeof shopkeepingTopic>
	}) {

	const state = mobxify({
		subscriptionPlanLoading: loading<SubscriptionPlan[]>(),
	})

	const load = onesie(async() => {
		await state.subscriptionPlanLoading.actions.setLoadingUntil({
			promise: shopkeepingService.listSubscriptionPlans(),
			errorReason: "failed to load subscription plans",
		})
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
