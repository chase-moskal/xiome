
import {Op, ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {preparePurchaseActions} from "./utils/subscription-actions.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles, property} from "../../../../framework/component.js"
import {PurchaseScenario, SubscriptionDetails, SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../types/store-concepts.js"

import xiomeSubscriptionsCss from "./xiome-subscriptions.css.js"
import {determinePurchaseScenario} from "../../common/determine-purchase-scenario.js"

@mixinStyles(xiomeSubscriptionsCss)
export class XiomeSubscriptions extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #modals() {
		return this.share.modals
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

	@property()
	private op: Op<void> = ops.ready(undefined)

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
		const {storeModel} = this.share
		const {tierId} = tier
		const isSubscribedToThisTier = tierIndex === subscribedTierIndex
		const noExistingSubscriptionForPlan = subscribedTierIndex === undefined
		const tierSubscription = this.#subscriptions.find(
			subscription => subscription.tierId === tierId
		)
		const subscriptionStatus = tierSubscription?.status
			?? SubscriptionStatus.Unsubscribed
		const {subscriptions, billing} = storeModel
		const isAnotherTierInPlanUnpaid = (
			subscription
			&& !isSubscribedToThisTier
			&& subscription.status === SubscriptionStatus.Unpaid
		)

		type Info = {
			stateLabel: string
			buttonLabel: string
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
							stateLabel: "",
							buttonLabel,
							action: async () => {
								const {
									upgradeOrDowngrade,
									buySubscriptionWithCheckoutPopup,
									buySubscriptionWithExistingPaymentMethod,
								} = preparePurchaseActions({
									storeModel: this.share.storeModel,
									modals: this.#modals,
									buttonLabel,
									tier
								})

								const scenario = determinePurchaseScenario({
									hasDefaultPaymentMethod: !!storeModel.get.billing.paymentMethod,
									hasExistingSubscription: !noExistingSubscriptionForPlan
								})

								switch (scenario) {
									case PurchaseScenario.Update:
										return await upgradeOrDowngrade()

									case PurchaseScenario.UsePaymentMethod:
										return await buySubscriptionWithExistingPaymentMethod()

									case PurchaseScenario.CheckoutPopup:
										return await ops.operation({
											promise: buySubscriptionWithCheckoutPopup(),
											setOp: newOp => this.op = newOp
										})

									default:
										throw new Error("unknown purchase scenario");
								}
							}
						}

				case SubscriptionStatus.Active:
					return {
						stateLabel: "purchased",
						buttonLabel: "cancel",
						action: async () => {
							await this.#modals.confirmAction({
								title: "Cancel subscription",
								message: `are you sure you want to cancel your ${tier.label} subscription`,
								loadingMessage: "cancelling subscription",
								actionWhenConfirmed: () => subscriptions.cancelSubscription(tierId)
							})
						},
					}

				case SubscriptionStatus.Unpaid:
					return {
						stateLabel: "payment failed",
						buttonLabel: "update now",
						action: async() => await ops.operation({
							promise: billing.customerPortal(),
							setOp: newOp => this.op = newOp
						}),
					}

				case SubscriptionStatus.Cancelled:
					return {
						stateLabel: "cancelled",
						buttonLabel: "renew",
						action: async () => {
							await this.#modals.confirmAction({
								title: "Renew subscription",
								message: `are you sure you want to renew your ${tier.label} subscription for $${centsToDollars(tier.pricing[0].price)}/month?`,
								loadingMessage: "renewing subscription",
								actionWhenConfirmed: () => subscriptions.uncancelSubscription(tierId),
							})
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
						value=${centsToDollars(tier.pricing[0].price)}>
						${tier.label}
					</xio-price-display>
					<p>monthly</p>
				</div>
				${info
					? html`
						<div class=label>
							${info.stateLabel}
							<button @click=${info.action}>
								${info.buttonLabel}
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
				this.op,
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
