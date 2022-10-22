
import {TierView} from "../../views/tier/view.js"
import {ops} from "../../../../../framework/ops.js"
import {makeStoreModel} from "../../model/model.js"
import {TierBasics} from "../../views/tier/types.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {ascertainTierContext} from "../../views/tier/utils/ascertain-tier-context.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"

@mixinStyles(styles, TierView.css)
export class XiomeStoreSubscriptionStatus extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #ongoingSubscriptions(): TierBasics[] {
		const {storeModel} = this.share

		const {
			mySubscriptionDetails = [],
			plans = [],
		} = storeModel.get.subscriptions

		return mySubscriptionDetails
			.map(subscription => {
				const plan = plans.find(p => p.planId === subscription.planId)
				const tier = plan.tiers.find(t => t.tierId === subscription.tierId)
				return {plan, tier, subscription}
			})
	}

	#renderCard(basics: TierBasics) {
		return html`
			<div part=card>
				<strong part=plan_label>${basics.plan.label}</strong>
				${
					TierView({
						basics,
						context: ascertainTierContext(basics),
						interactivity: undefined,
					})
				}
			</div>
		`
	}

	render() {
		const {
			stripeConnect: {connectStatusOp},
			subscriptions: {subscriptionPlansOp, mySubscriptionDetailsOp},
		} = this.share.storeModel.state

		return renderOp(
			ops.combine(
				subscriptionPlansOp,
				mySubscriptionDetailsOp,
				connectStatusOp
			),
			() => html`
				<div part=card_list>
					${
						this.#ongoingSubscriptions
							.map(basics => this.#renderCard(basics))
					}
				</div>
			`
		)
	}
}
