
import {Service} from "../../../../types/service.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {SubscriptionPlan} from "../../topics/types/subscription-plan.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"

export function subscriptionPlanningModel({shopkeepingService}: {
			shopkeepingService: Service<typeof shopkeepingTopic>
		}) {

	const state = mobxify({
		subscriptionPlans: <SubscriptionPlan[]>[],
		setSubscriptionPlans(plans: SubscriptionPlan[]) {
			state.subscriptionPlans = plans
		},
	})

	return {
		async load() {
			// const lol = shopkeepingService.
		}
	}
}
