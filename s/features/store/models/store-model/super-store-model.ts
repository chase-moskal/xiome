
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {statusCheckerTopic} from "../../topics/status-checker-topic.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {storageCache} from "../../../../toolbox/flex-storage/cache/storage-cache.js"
import {mobxify} from "../../../../framework/mobxify.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {loading} from "../../../../framework/loading/loading.js"
import {statusTogglerTopic} from "../../topics/status-toggler-topic.js"
import {PlanningSituation} from "../subscription-planning-model/types/planning-situation.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {isAllowedToPlanSubscriptions} from "../subscription-planning-model/helpers/is-allowed-to-plan-subscriptions.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"
import {SubscriptionPlan} from "../../topics/types/subscription-plan.js"
import {Loading} from "../../../../framework/loading/types/loading.js"
import {Op, ops} from "../../../../framework/ops.js"
import {debounce2} from "../../../../toolbox/debounce2.js"
import {objectMap} from "../../../../toolbox/object-map.js"
import {deepClone, deepFreeze} from "../../../../toolbox/deep.js"
import {stateWrangler} from "../../../../toolbox/state-wrangler/state-wrangler.js"
import {pubsub} from "../../../../toolbox/pubsub.js"
import {mobbdeep} from "../../../../toolbox/mobbdeep/mobbdeep.js"

export interface StoreState {
	access: AccessPayload
	status: Op<StoreStatus>
	subscriptionPlans: Op<SubscriptionPlan>
	permissions: {
		canWriteSubscriptionPlans: boolean
	}
}

export function superStoreModel() {

	const {
		publish: renderPublish,
		subscribe: renderSubscribe,
	} = pubsub<(state: StoreState) => void>()

	const actions = stateWrangler<StoreState>({
		render: renderPublish,
		debug: console.log.bind(console),
		initial: {
			access: undefined,
			status: ops.loading(),
			subscriptionPlans: ops.loading(),
			permissions: {
				canWriteSubscriptionPlans: false,
			},
		},
	})({

		setAccess(state, access: AccessPayload) {
			return {...state, access}
		},

		setStatus(state, status: Op<StoreStatus>) {
			return {...state, status}
		},

		setSubscriptionPlans(state, subscriptionPlans: Op<SubscriptionPlan>) {
			return {...state, subscriptionPlans}
		},
	})

	return {
		actions,
		renderSubscribe,
	}
}

export function altStoreModel() {
	const mobb = mobbdeep()

	const state: StoreState = mobb.observables({
		access: undefined,
		status: ops.loading(),
		subscriptionPlans: ops.loading(),
		permissions: {
			canWriteSubscriptionPlans: false,
		},
	})

	const actions = mobb.actions({
		setAccess(access: AccessPayload) {
			state.access = access
		},
		setStatus(status: Op<StoreStatus>) {
			state.status = status
		},
		setSubscriptionPlans(plans: Op<SubscriptionPlan>) {
			state.subscriptionPlans = plans
		},
	})

	return {actions, watch: mobb.watch}
}
