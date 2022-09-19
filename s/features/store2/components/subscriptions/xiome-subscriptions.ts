
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"
import {SubscriptionDetails, SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../types/store-concepts.js"

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
			.filter(plan => !plan.archived)
			.filter(plan => plan.tiers.length)
	}

	get #subscriptions() {
		return ops.value(this.#state.subscriptions.mySubscriptionDetailsOp)
	}

	#renderTier = ({
			tier, tierIndex,
			subscribedTierIndex,
			subscription,
		}: {
			tier: SubscriptionTier
			tierIndex: number
			subscription: SubscriptionDetails
			subscribedTierIndex: number | undefined
		}) => {
		const {tierId} = tier
		const isSubscribedToThisTier = tierIndex === subscribedTierIndex
		const noExistingSubscriptionForPlan = subscribedTierIndex === undefined
		const tierSubscription = this.#subscriptions.find(
			subscription => subscription.tierId === tierId
		)
		const subscriptionStatus = tierSubscription?.status
			?? SubscriptionStatus.Unsubscribed
		const {subscriptions, billing} = this.share.storeModel
		const isAnotherTierInPlanUnpaid = (
			subscription
			&& !isSubscribedToThisTier
			&& subscription.status === SubscriptionStatus.Unpaid
		)

		type Info = {
			state: string
			button: string
			action: () => Promise<void>
		}

		const info = ((): Info | undefined => {
			switch (subscriptionStatus) {

				case SubscriptionStatus.Unsubscribed:
					return isAnotherTierInPlanUnpaid
						? undefined
						: {
							state: "",
							button: noExistingSubscriptionForPlan
								? "buy"
								: (subscribedTierIndex > tierIndex)
									? "downgrade"
									: "upgrade",
							action: () => subscriptions.purchase(tierId),
						}

				case SubscriptionStatus.Active:
					return {
						state: "purchased",
						button: "cancel",
						action: () => subscriptions.cancelSubscription(tierId),
					}

				case SubscriptionStatus.Unpaid:
					return {
						state: "payment failed",
						button: "update now",
						action: () => billing.customerPortal(),
					}

				case SubscriptionStatus.Cancelled:
					return {
						state: "cancelled",
						button: "renew",
						action: () => subscriptions.uncancelSubscription(tierId),
					}

				default:
					throw new Error("unknown subscription status")
			}
		})()

		return html`
			<div
				class="tier"
				data-tier=${tier.tierId}
				?data-subscribed=${isSubscribedToThisTier}>
				<slot name="${tier.tierId}"></slot>
				<div class=details>
					<h2>${tier.label}</h2>
					<xio-price-display
						unit-superscript
						vertical-currency
						value=${centsToDollars(tier.pricing.price)}>
						${tier.label}
					</xio-price-display>
					<p>monthly</p>
				</div>
				${info
					? html`
						<div class=label>
							${info.state}
							<button @click=${info.action}>
								${info.button}
							</button>
						</div>
					`
					: null}
			</div>
		`
	}

	#renderPlan = (plan: SubscriptionPlan) => {
		const tiers = plan.tiers.filter(tier => tier.active)

		let subscription: SubscriptionDetails
		let subscribedTierIndex = undefined as number

		for (const [index, tier] of tiers.entries()) {
			const foundSubscription = this.#subscriptions.find(
				sub => sub.tierId === tier.tierId
			)
			if (foundSubscription) {
				subscription = foundSubscription
				subscribedTierIndex = index
				break
			}
		}

		return html`
			<li data-plan=${plan.planId}>
				<p>${plan.label}</p>
				<div class=tiers>
					${plan.tiers
						.filter(tier => tier.active)
						.map((tier, tierIndex) => this.#renderTier({
							tier, tierIndex, subscribedTierIndex, subscription,
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
