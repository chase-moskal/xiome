
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {SubscriptionPlan} from "../../types/store-concepts.js"
import {centsToPrice} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeSubscriptionsCss from "./xiome-subscriptions.css.js"

@mixinStyles(xiomeSubscriptionsCss)
export class XiomeSubscriptions extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	render() {
		const {state} = this.share.storeModel
		const plans = ops.value(state.subscriptions.subscriptionPlansOp)
		const details = ops.value(state.subscriptions.subscriptionDetailsOp)
		const op = ops.combine(
			state.subscriptions.subscriptionPlansOp,
			state.subscriptions.subscriptionDetailsOp,
		)
		return renderOp(op, () => html`
			<ol class=plans>
				${validPlans(plans).map(plan => html`
					<li data-plan=${plan.planId}>
						<p>${plan.label}</p>
						<div class=tiers>
							${plan.tiers.filter(tier => tier.active).map(tier => html`
								<div
									data-tier=${tier.tierId}
									?data-subscribed=${details.tierIds.includes(tier.tierId)}>
									<button>
										<slot name="${tier.tierId}"></slot>
										<div class=details>
											<div>${tier.label}</div>
											<div>$${centsToPrice(tier.price)}</div>
											<div>monthly</div>
										</div>
										<div class=label>
											choose
										</div>
									</button>
								</div>
							`)}
						</div>
					</li>
				`)}
			</ol>
		`)
	}
}

function validPlans(plans: SubscriptionPlan[]) {
	return plans
		.filter(plan => plan.active)
		.filter(plan => plan.tiers.length)
}
