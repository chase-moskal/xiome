
import {ops} from "../../../../../framework/ops.js"
import {makeStoreModel} from "../../model/model.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {StripeConnectStatus, SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../../isomorphic/concepts.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"
import checkSvg from "../../../../../framework/icons/check.svg.js"
import crossSvg from "../../../../../framework/icons/cross.svg.js"
import {TierView} from "../../views/tier/view.js"
import {TierBasics} from "../../views/tier/types.js"
import {ascertainTierContext} from "../../views/tier/utils/ascertain-tier-context.js"

@mixinStyles(styles, TierView.css)
export class XiomeStoreSubscriptionStatus extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #ongoingSubscriptions(): TierBasics[] {
		const {storeModel} = this.share

		const {
			mySubscriptionDetails = [],
			plans = []
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
			<div class=card>
				<strong>${basics.plan.label}</strong>
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
				<div class=cardlist>
					${
						this.#ongoingSubscriptions
							.map(basics => this.#renderCard(basics))
					}
				</div>
			`
		)
	}
}
