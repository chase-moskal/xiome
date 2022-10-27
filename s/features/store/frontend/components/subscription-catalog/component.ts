
import {makeStoreModel} from "../../model/model.js"
import {TierBasics} from "../../views/tier/types.js"
import {ops, Op} from "../../../../../framework/ops.js"
import {html} from "../../../../../framework/component.js"
import {TemplateSlots} from "../../../../../toolbox/template-slots.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {SubscriptionPlan, SubscriptionTier} from "../../../isomorphic/concepts.js"
import {ascertainTierContext} from "../../views/tier/utils/ascertain-tier-context.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"
import {asPropertyDeclarations, component} from "../../../../../toolbox/magical-component.js"
import {ascertainTierInteractivity} from "../../views/tier/utils/apprehend-tier-interactivity.js"

import styles from "./styles.js"

type Props = {
	"allow-plans": string
}

const properties = asPropertyDeclarations<Props>({
	"allow-plans": {type: String},
})

export const XiomeStoreSubscriptionCatalog = ({modals, storeModel}: {
	modals: ModalSystem
	storeModel: ReturnType<typeof makeStoreModel>
}) => component<Props>({
	styles,
	properties,
	shadow: false,
}, use => {

	use.setup(() => storeModel.snap.subscribe(() => use.element.requestUpdate()))
	const {state} = storeModel
	const [op, setOp] = use.state<Op<void>>(ops.ready(undefined))
	const [slots] = use.state(() =>
		new TemplateSlots(
			use.element,
			() => use.element.requestUpdate(),
		)
	)

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
		const subscription = (
			mySubscriptionDetails
				.find(s => s.planId === plan.planId)
		)
		const basics: TierBasics = {
			plan,
			tier,
			subscription,
			pricing: tier.pricing && tier.pricing[0],
		}
		const hasPricing = !!basics.pricing
		const context = ascertainTierContext(basics)
		const interactivity = ascertainTierInteractivity({
			basics,
			context,
			modals,
			storeModel,
			setOp,
		})
		return hasPricing 
			? html`
				<xiome-store-subscription-tier
					.basics=${basics}
					.context=${context}
					.interactivity=${interactivity}>
						${slots.get(tier.tierId)}
				</xiome-store-subscription-tier>
			`
			: null
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
			<ol part=plans>
				${plans.map(renderPlan)}
			</ol>
		`
	)
})
