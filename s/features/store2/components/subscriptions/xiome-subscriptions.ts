
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

	get #storeModel() {
		return this.share.storeModel
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
					const buttonLabel = noExistingSubscriptionForPlan
						? "buy"
						: (subscribedTierIndex > tierIndex)
							? "downgrade"
							: "upgrade"

					return isAnotherTierInPlanUnpaid
						? undefined
						: {
							state: "",
							button: buttonLabel,
							action: async () => {
								const hasDefaultPaymentMethod = !!this.#storeModel.
									get.billing.paymentMethod
								const willNeedCheckoutPopup =
									!isSubscribedToThisTier && !hasDefaultPaymentMethod
								if(!willNeedCheckoutPopup) {
									const proceedWithPurchase = await this.share.modals.confirm({
										title: `${buttonLabel} subscription`,
										body: html`are you sure you want to ${buttonLabel} ${buttonLabel === "buy" ? "": `your subscription to`} <strong>${tier.label}</strong> for $${centsToDollars(tier.pricing.price)}/month?`
									})
									if(!proceedWithPurchase) return
								}
								await subscriptions.purchase(tierId)
								if (buttonLabel !== "buy")
									this.share.modals.alert({
										title: html`your subscription ${buttonLabel} to <strong>${tier.label}</strong> was successfull`
									})
							}
						}

				case SubscriptionStatus.Active:
					return {
						state: "purchased",
						button: "cancel",
						action: async () => {
							const isCanceled = await this.share.modals.confirm({
								title: `Cancel subscription`,
								body: html`are you sure you want to cancel your <strong>${tier.label}</strong> subscription`
							})
							if(isCanceled) {
								subscriptions.cancelSubscription(tierId)
								this.share.modals.alert({
									title: `ssndsndkndknsknsknkddsnkdnksnd`
								})
							}
						},
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
						action: async () => {
							const isRenewed = await this.share.modals.confirm({
								title: `Renew subscription`,
								body: html`are you sure you want to renew your <strong>${tier.label}</strong> subscription for $${centsToDollars(tier.pricing.price)}/month?`
							})
							if(isRenewed) subscriptions.uncancelSubscription(tierId)
						},
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
