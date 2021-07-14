
import {storeCore} from "../core/store-core.js"
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {PlanningSituation} from "./types/planning-situation.js"
import {shopkeepingTopic} from "../../topics/shopkeeping-topic.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {userCanManageStore} from "./permissions-helpers/user-can-manage-store.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"

export function subscriptionPlanningShare({
		shopkeepingService,
		core: {state, actions},
	}: {
		core: ReturnType<typeof storeCore>
		shopkeepingService: Service<typeof shopkeepingTopic>
	}) {

	const loadPlans = onesie(async function() {
		const situation = state.subscriptionPlanning
		if (situation.mode === PlanningSituation.Mode.Privileged) {
			await ops.operation({
				promise: shopkeepingService.listSubscriptionPlans(),
				errorReason: "failed to load subscription plans",
				setOp: op => actions.setSubscriptionPlanningSituation({
					...situation,
					plans: op,
				}),
			})
		}
	})

	let activated = false
	async function activate() {
		if (!activated) {
			activated = true
			await loadPlans()
		}
	}

	function getPrivilegedSituation() {
		if (state.subscriptionPlanning.mode !== PlanningSituation.Mode.Privileged)
			throw new Error("not privileged for subscription planning")
		return state.subscriptionPlanning
	}

	async function createPlan(draft: SubscriptionPlanDraft) {
		async function action() {
			const plan = await shopkeepingService.createSubscriptionPlan({draft})
			const situation = getPrivilegedSituation()
			const existingPlans = ops.value(situation.plans)
			const newPlans = [...existingPlans, plan]
			actions.setSubscriptionPlanningSituation({
				...situation,
				plans: ops.ready(newPlans),
			})
			return plan
		}
		return ops.operation({
			promise: action(),
			setOp: op => actions.setSubscriptionPlanningSituation({
				...getPrivilegedSituation(),
				planCreation: ops.replaceValue(op, undefined)
			}),
		})
	}

	async function listAfterwards(action: () => Promise<void>) {
		return ops.operation({

			promise: action()
				.then(shopkeepingService.listSubscriptionPlans),

			setOp: op => actions.setSubscriptionPlanningSituation({
				...getPrivilegedSituation(),
				plans: op,
			}),
		})
	}

	async function deactivatePlan(subscriptionPlanId: string) {
		return listAfterwards(
			() => shopkeepingService.deactivateSubscriptionPlan({subscriptionPlanId})
		)
	}

	async function deletePlan(subscriptionPlanId: string) {
		return listAfterwards(
			() => shopkeepingService.deleteSubscriptionPlan({subscriptionPlanId})
		)
	}

	function setSituationAccordingToAccess(access: AccessPayload) {
		actions.setSubscriptionPlanningSituation(
			access
				? userCanManageStore(access)
					? {
						mode: PlanningSituation.Mode.Privileged,
						plans: ops.none(),
						planCreation: ops.ready(undefined),
					}
					: {mode: PlanningSituation.Mode.Unprivileged}
				: {mode: PlanningSituation.Mode.LoggedOut}
		)
	}

	return {
		async accessChange() {
			setSituationAccordingToAccess(state.access)
		},
		get access() {
			return state.access
		},
		get situation() {
			return state.subscriptionPlanning
		},
		activate,
		createPlan,
		deactivatePlan,
		deletePlan,
	}
}
