
import {ops} from "../../../../../framework/ops.js"
import {makeStoreModel} from "../../model/model.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {StripeConnectStatus, SubscriptionPlan, SubscriptionStatus} from "../../../isomorphic/concepts.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"
import checkSvg from "../../../../../framework/icons/check.svg.js"
import crossSvg from "../../../../../framework/icons/cross.svg.js"

@mixinStyles(styles)
export class XiomeStoreSubscriptionStatus extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #subscriptions() {
		return ops.value(this.#state.subscriptions.mySubscriptionDetailsOp)
	}

	get #plans() {
		const plans = ops.value(this.#state.subscriptions.subscriptionPlansOp)
			?? []
		return plans
			.filter(plan => !plan.archived)
			.filter(plan => plan.tiers.length)
	}

	get #subscribedPlans() {
		const subscribedPlanIds = this.#subscriptions?.map(
			subscription => subscription.planId
		)
		return this.#plans
			.filter(plan => subscribedPlanIds?.includes(plan.planId))
	}

	#renderStatusCard = (plan: SubscriptionPlan) => {

		const tierSubscription = this.#subscriptions?.find(
			subscription => subscription.planId === plan.planId)

		const subscribedTier = plan.tiers.find(
			tier => tier.tierId === tierSubscription.tierId)

		const {label, pricing} = subscribedTier

		const statusInfo = tierSubscription?.status === SubscriptionStatus.Cancelled
			? {label: "cancelled", icon: crossSvg}
			: tierSubscription?.status === SubscriptionStatus.Active
				? {label: "purchased", icon: checkSvg}
				: {}

		const isPaid = tierSubscription.status !== SubscriptionStatus.Unpaid

		return isPaid
			? html`
				<div class="status_card">
					<p>${plan.label}</p>
					<div class="tier_details">
						<p class="tier_label">${label}</p>
						<xio-price-display
							unit-superscript
							currency=${pricing[0].currency}
							value=${centsToDollars(pricing[0].price)}
						></xio-price-display>
						<p>monthly</p>
						<div class="status_label">${statusInfo.label}</div>
						<div data-status=${statusInfo.label} class="status_icon">
							${statusInfo.icon}
						</div>
					</div>
				</div>
			`
			: null
	}

	render() {
		const hasSubscriptions = this.#subscriptions?.length > 0
		const {subscriptionPlansOp, mySubscriptionDetailsOp} =
			this.#state.subscriptions
		const {connectStatusOp} = this.#state.stripeConnect
		const connectStatus = ops.value(connectStatusOp)
		const combinedOp = ops.combine(
			subscriptionPlansOp, mySubscriptionDetailsOp, connectStatusOp)
		return renderOp(combinedOp, () => {
			return connectStatus !== StripeConnectStatus.Ready || !hasSubscriptions
				? null
				: html`
					<div class="body">
						<h3>Current Subscriptions</h3>
						<div class="subscriptions">
							${this.#subscribedPlans.map(this.#renderStatusCard)}
						</div>
					</div>
				`
			})
	}
}
