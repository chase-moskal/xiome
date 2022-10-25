
import styles from "./styles.js"
import {makeStoreModel} from "../../model/model.js"
import {TierBasics} from "../../views/tier/types.js"
import {ops, Op} from "../../../../../framework/ops.js"
import {html} from "../../../../../framework/component.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {SubscriptionPlan, SubscriptionTier} from "../../../isomorphic/concepts.js"
import {component, TemplateSlots} from "../../../../../toolbox/magical-component.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export const XiomeStoreSubscriptionCatalogThree = ({modals, storeModel}: {
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}) => component<{
		"allow-plans": string
	}>({

	properties: {
		"allow-plans": {},
	},

	styles,
	shadow: false,

	render: use => {
		const {state} = storeModel
		const [op, setOp] = use.state<Op<void>>(ops.ready(undefined))
		const [slots] = use.state(() => new TemplateSlots(use.element))
		use.setup(() => storeModel.snap.subscribe(() => use.element.requestUpdate()))

		const plans = (() => {
			const allowedPlans = use.element["allow-plans"]?.match(/(\w+)/g)
			const plans = storeModel.get.subscriptions.plans ?? []
			const activePlans = plans
				.filter(plan => !plan.archived)
				.filter(plan => plan.tiers.length)
			return !!use.element["allow-plans"]
				? activePlans.filter(plan => allowedPlans.includes(plan.planId))
				: activePlans
		})()

		function renderTier(plan: SubscriptionPlan, tier: SubscriptionTier) {
			const {mySubscriptionDetails} = storeModel.get.subscriptions
			const subscription =
				mySubscriptionDetails
					.find(s => s.planId === plan.planId)
			const basics: TierBasics = {
				plan,
				tier,
				subscription,
			}
		}

		function renderPlan(plan: SubscriptionPlan) {
			return html`
				<li data-plan=${plan.planId} part=plan>
					<h3 part=planlabel>${plan.label}</h3>
					<div part=tiers>
						${
							plan.tiers
								.filter(tier => tier.active)
								.map(tier => renderTier(plan, tier))
						}
					</div>
				</li>
			`
		}

		return renderOp(
			ops.combine(
				op,
				state.subscriptions.subscriptionPlansOp,
				state.subscriptions.mySubscriptionDetailsOp,
			),
			() => html`
				${slots.get("alpha")}
				<ol part=plans>
					${plans.map(renderPlan)}
				</ol>
			`
		)
	},
})

// @mixinStyles(styles)
// export class XiomeStoreSubscriptionCatalogTwo extends (
// 		mixinTemplateSlotting(
// 			mixinRequireShare<{
// 				modals: ModalSystem
// 				storeModel: ReturnType<typeof makeStoreModel>
// 			}>()(Component)
// 		)
// 	) {

// 	@property({type: String})
// 	["allow-plans"]: string

// 	get #plans() {
// 		const allowedPlans = this["allow-plans"]?.match(/(\w+)/g)
// 		const plans = this.share.storeModel.get.subscriptions.plans ?? []
// 		const activePlans = plans
// 			.filter(plan => !plan.archived)
// 			.filter(plan => plan.tiers.length)
// 		return !!this["allow-plans"]
// 			? activePlans.filter(plan => allowedPlans.includes(plan.planId))
// 			: activePlans
// 	}

// 	@property()
// 	private op: Op<void> = ops.ready(undefined)

// 	#renderTier(plan: SubscriptionPlan, tier: SubscriptionTier) {
// 		const {storeModel, modals} = this.share
// 		const {mySubscriptionDetails} = storeModel.get.subscriptions
// 		const subscription =
// 			mySubscriptionDetails
// 				.find(s => s.planId === plan.planId)

// 		const basics: TierBasics = {
// 			plan,
// 			tier,
// 			subscription,
// 		}
// 	}

// 	#renderPlan = (plan: SubscriptionPlan) => {
// 		return html`
// 			<li data-plan=${plan.planId} part=plan>
// 				<h3 part=planlabel>${plan.label}</h3>
// 				<div part=tiers>
// 					${
// 						plan.tiers
// 							.filter(tier => tier.active)
// 							.map(tier => this.#renderTier(plan, tier))
// 					}
// 				</div>
// 			</li>
// 		`
// 	}

// 	render() {
// 		const {state} = this.share.storeModel
// 		return renderOp(
// 			ops.combine(
// 				this.op,
// 				state.subscriptions.subscriptionPlansOp,
// 				state.subscriptions.mySubscriptionDetailsOp,
// 			),
// 			() => html`
// 				<ol part=plans>
// 					${this.#plans.map(this.#renderPlan)}
// 				</ol>
// 			`
// 		)
// 	}
// }
