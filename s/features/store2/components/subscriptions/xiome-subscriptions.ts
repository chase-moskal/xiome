
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../types/store-concepts.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeSubscriptionsCss from "./xiome-subscriptions.css.js"

@mixinStyles(xiomeSubscriptionsCss)
export class XiomeSubscriptions extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #plans() {
		const plans = ops.value(this.#state.subscriptions.subscriptionPlansOp)
			?? []
		return plans
			.filter(plan => plan.active)
			.filter(plan => plan.tiers.length)
	}

	get #subscription() {
		return ops.value(this.#state.subscriptions.mySubscriptionDetailsOp)
	}

	#prepareTierManager({tierId}: SubscriptionTier) {
		const isSubscribedToThisTier = this.#subscription.tierIds.includes(tierId)
		const paymentMethod = ops.value(this.#state.billing.paymentMethodOp)
		const subscriptionStatus = this.#subscription?.status
		const subscriptionIsActive = subscriptionStatus === SubscriptionStatus.Active

		const {subscriptions, billing} = this.share.storeModel

		return {
			isSubscribedToThisTier,
			handleTierClick: async() => {
				if (isSubscribedToThisTier) {
					await subscriptions.cancelSubscription()
				}
				else {
					if (subscriptionIsActive) {
						if (paymentMethod) {
							await subscriptions
								.updateExistingSubscriptionWithNewTier(tierId)
						}
						else {
							await billing.checkoutPaymentMethod()
							await subscriptions
								.updateExistingSubscriptionWithNewTier(tierId)
						}
					}
					else {
						if (paymentMethod) {
							await subscriptions.checkoutSubscriptionTier(tierId)
						}
						else {
							await subscriptions.checkoutSubscriptionTier(tierId)
						}
					}
				}
			},
		}
	}

	// #handleTierClick = ({tierId}: SubscriptionTier) => async() => {
	// 	const state = this.#state
	// 	const {subscriptionsSubmodel, billingSubmodel} = this.share.storeModel

	// 	const paymentMethod = !!ops.value(state.billing.paymentMethodOp)
	// 	const subscriptionStatus =
	// 		ops.value(state.subscriptions.subscriptionDetailsOp)?.status
	// 	const subscriptionIsActive =
	// 		subscriptionStatus === SubscriptionStatus.Active

	// 	if (paymentMethod) {
	// 		if (subscriptionIsActive)
	// 			await subscriptionsSubmodel
	// 				.updateExistingSubscriptionWithNewTier(tierId)
	// 		else
	// 			await subscriptionsSubmodel.checkoutSubscriptionTier(tierId)
	// 	}
	// 	else {
	// 		if (subscriptionIsActive) {
	// 			await billingSubmodel.checkoutPaymentMethod()
	// 			await subscriptionsSubmodel
	// 				.updateExistingSubscriptionWithNewTier(tierId)
	// 		}
	// 		else
	// 			await subscriptionsSubmodel.checkoutSubscriptionTier(tierId)
	// 	}
	// }

	#renderTier = (tier: SubscriptionTier) => {
		// const isSubscribed = this.#subscription.tierIds.includes(tier.tierId)
		const manager = this.#prepareTierManager(tier)
		return html`
			<button
				data-tier=${tier.tierId}
				?data-subscribed=${manager.isSubscribedToThisTier}
				@click=${manager.handleTierClick}>
					<slot name="${tier.tierId}"></slot>
					<div class=details>
						<div>${tier.label}</div>
						<div>$${centsToDollars(tier.pricing.price)}</div>
						<div>monthly</div>
					</div>
					<div class=label>
						${manager.isSubscribedToThisTier
							? "cancel"
							: "buy"}
					</div>
			</button>
		`
	}

	#renderPlan = (plan: SubscriptionPlan) => {
		return html`
			<li data-plan=${plan.planId}>
				<p>${plan.label}</p>
				<div class=tiers>
					${plan.tiers
						.filter(tier => tier.active)
						.map(this.#renderTier)}
				</div>
			</li>
		`
	}

	render() {
		return renderOp(
			ops.combine(
				this.#state.subscriptions.subscriptionPlansOp,
				this.#state.subscriptions.mySubscriptionDetailsOp,
			),
			() => html`
				<ol class=plans>
					${this.#plans.map(this.#renderPlan)}
				</ol>
			`
		)
	}
}
