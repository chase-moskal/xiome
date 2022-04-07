
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {centsToPrice} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {SubscriptionPlan, SubscriptionTier} from "../../types/store-concepts.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeSubscriptionsCss from "./xiome-subscriptions.css.js"

@mixinStyles(xiomeSubscriptionsCss)
export class XiomeSubscriptions extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #plans() {
		const {state} = this.share.storeModel
		const plans = ops.value(state.subscriptions.subscriptionPlansOp) ?? []
		return plans
			.filter(plan => plan.active)
			.filter(plan => plan.tiers.length)
	}

	#handleTierClick = ({tierId}: SubscriptionTier) => async() => {
		const {subscriptionsSubmodel, billingSubmodel} = this.share.storeModel
		const {state} = this.share.storeModel

		const paymentMethod = !!ops.value(state.billing.paymentMethodOp)
		const subscription = ops.value(state.subscriptions.subscriptionDetailsOp)

		// TODO deal with subscription status?

		if (paymentMethod) {
			if (subscription)
				await subscriptionsSubmodel.updateExistingSubscriptionWithNewTier(tierId)
			else
				await subscriptionsSubmodel.checkoutSubscriptionTier(tierId)
		}
		else {
			if (subscription) {
				await billingSubmodel.checkoutPaymentMethod()
				await subscriptionsSubmodel.updateExistingSubscriptionWithNewTier(tierId)
			}
			else
				await subscriptionsSubmodel.checkoutSubscriptionTier(tierId)
		}
	}

	#renderTier(plan: SubscriptionPlan) {
		const {state} = this.share.storeModel
		const subscription = ops.value(state.subscriptions.subscriptionDetailsOp)
		return html`
			<div class=tiers>
				${plan.tiers.filter(tier => tier.active).map(tier => html`
					<button
						data-tier=${tier.tierId}
						?data-subscribed=${subscription.tierIds.includes(tier.tierId)}
						@click=${this.#handleTierClick(tier)}>
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
				`)}
			</div>
		`
	}

	render() {
		const {state} = this.share.storeModel
		const op = ops.combine(
			state.subscriptions.subscriptionPlansOp,
			state.subscriptions.subscriptionDetailsOp,
		)
		return renderOp(op, () => html`
			<ol class=plans>
				${this.#plans.map(plan => html`
					<li data-plan=${plan.planId}>
						<p>${plan.label}</p>
						${this.#renderTier(plan)}
					</li>
				`)}
			</ol>
		`)
	}
}
