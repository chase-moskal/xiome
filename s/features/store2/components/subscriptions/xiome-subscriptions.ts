
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../types/store-concepts.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeSubscriptionsCss from "./xiome-subscriptions.css.js"

// // TODO multisub: maybe use a magical view somewhere if you want?
// import {view} from "@chasemoskal/magical/x/view/view.js"

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

	get #subscriptions() {
		return ops.value(this.#state.subscriptions.mySubscriptionDetailsOp)
	}

	#prepareTierManager({tierId}: SubscriptionTier) {

		// TODO multisub: refactor so this component can render the status of
		// multiple subscription plans

		const presentTierSubscriptionDetails = this.#subscriptions.find(
			subscription => subscription.tierId === tierId)
		const isSubscribedToThisTier = !!presentTierSubscriptionDetails
		const paymentMethod = ops.value(this.#state.billing.paymentMethodOp)
		const subscriptionStatus = presentTierSubscriptionDetails?.status
		const subscriptionIsActive = subscriptionStatus === SubscriptionStatus.Active
		const isCanceled = subscriptionStatus === SubscriptionStatus.Cancelled

		const {subscriptions, billing} = this.share.storeModel

		return {
			isSubscribedToThisTier,
			isCanceled,
			handleTierClick: async() => {
				console.log(this.#subscriptions)
				if (isSubscribedToThisTier) {
					!isCanceled
						? await subscriptions.cancelSubscription(tierId)
						: await subscriptions.uncancelSubscription(tierId)
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

	#renderTier = ({tier, currentIndex, indexOfSubscribed}: {
		tier: SubscriptionTier
		currentIndex: number
		indexOfSubscribed: number | undefined
	}) => {
		const {
			handleTierClick,
			isSubscribedToThisTier,
			isCanceled
		} = this.#prepareTierManager(tier)
		const textToDisplay = indexOfSubscribed === undefined
			? "buy"
			: indexOfSubscribed > currentIndex ? "downgrade" : "upgrade"
		return html`
			<div
				class="tier"
				data-tier=${tier.tierId}
				?data-subscribed=${isSubscribedToThisTier}>
				<slot name="${tier.tierId}"></slot>
				<div class=details>
					<div>${tier.label}</div>
					<div>$${centsToDollars(tier.pricing.price)}</div>
					<div>monthly</div>
				</div>
				<div class=label>
					${isSubscribedToThisTier
						? isCanceled
							? "Cancelled"
							: "Purchased"
						: null
					}
					<button
						@click=${handleTierClick}>
						${isSubscribedToThisTier
							? isCanceled
								? "re-activate"
								: "cancel"
							: textToDisplay}
					</button>
				</div>
			</div>
		`
	}

	#renderPlan = (plan: SubscriptionPlan) => {
		const tiers = plan.tiers.filter(tier => tier.active)
		let indexOfSubscribed = undefined as number
		for (const [index, tier] of tiers.entries()) {
			const details = this.#subscriptions.find(
				subscription => subscription.tierId === tier.tierId
			)
			if (details) indexOfSubscribed = index
		}
		return html`
			<li data-plan=${plan.planId}>
				<p>${plan.label}</p>
				<div class=tiers>
					${plan.tiers
						.filter(tier => tier.active)
						.map((tier, currentIndex) => this.#renderTier({
							tier, currentIndex, indexOfSubscribed
						}))}
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
