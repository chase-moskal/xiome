
import {makeStoreModel} from "../model/model.js"
import {Op, Ops, ops} from "../../../../framework/ops.js"
import {centsToDollars} from "../components/subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {determinePurchaseScenario} from "../../isomorphic/utils/determine-purchase-scenario.js"
import {preparePurchaseActions} from "../components/subscription-catalog/utils/subscription-actions.js"
import {PaymentMethod, PurchaseScenario, SubscriptionDetails, SubscriptionPlan, SubscriptionStatus, SubscriptionTier} from "../../isomorphic/concepts.js"

export interface TierBasics {
	tier: SubscriptionTier
	plan: SubscriptionPlan
	mySubscriptionDetails: SubscriptionDetails[]
}

export enum TierButton {
	Buy,
	Upgrade,
	Downgrade,
	Pay,
	Cancel,
	Renew,
}

export interface TierInteractivity {
	button: TierButton
	action: () => Promise<void>
}

export interface TierContext {
	subscription: SubscriptionDetails | undefined
	tierIndex: number
	status: SubscriptionStatus
	subscribedTierIndex: number | undefined
	isSubscribedToThisTier: boolean
	isAnotherTierInPlanUnpaid: boolean
}

export function getStatusLabel(status: SubscriptionStatus) {
	switch (status) {

		case SubscriptionStatus.Unsubscribed:
			return undefined

		case SubscriptionStatus.Active:
			return "active"

		case SubscriptionStatus.Unpaid:
			return "payment failed"

		case SubscriptionStatus.Cancelled:
			return "cancelled"
	}
}

export function getButtonLabel(button: TierButton) {
	switch (button) {

		case TierButton.Buy:
			return "buy"

		case TierButton.Downgrade:
			return "downgrade"

		case TierButton.Upgrade:
			return "upgrade"

		case TierButton.Pay:
			return "pay"

		case TierButton.Cancel:
			return "cancel"

		case TierButton.Renew:
			return "renew"
	}
}

export function ascertainTierContext({
		tier,
		plan,
		mySubscriptionDetails,
	}: TierBasics): TierContext {

	const {tierId} = tier

	const tierIndex = (
		plan
			.tiers
			.findIndex(t => t.tierId === tierId)
	)

	const subscription = (
		mySubscriptionDetails
			.find(s => s.planId === plan.planId)
	)

	const subscribedTierIndex = subscription && (
		plan
			.tiers
			.findIndex(t => t.tierId === subscription.tierId)
	)

	const isSubscribedToThisTier = !!subscription && (
		tierIndex === subscribedTierIndex
	)

	const status = isSubscribedToThisTier
		? (
			subscription?.status
				?? SubscriptionStatus.Unsubscribed
		)
		: SubscriptionStatus.Unsubscribed

	const isAnotherTierInPlanUnpaid = (
		subscription
			&& !isSubscribedToThisTier
			&& subscription.status === SubscriptionStatus.Unpaid
	)

	return {
		subscription,
		status,
		tierIndex,
		subscribedTierIndex,
		isSubscribedToThisTier,
		isAnotherTierInPlanUnpaid,
	}
}

export function ascertainTierInteractivity({
		basics: {tier},
		context: {
			subscription,
			status,
			tierIndex,
			subscribedTierIndex,
			isAnotherTierInPlanUnpaid,
		},
		modals,
		storeModel,
		paymentMethod,
		setOp,
	}: {
		basics: TierBasics,
		context: TierContext
		paymentMethod: PaymentMethod | undefined
		storeModel: ReturnType<typeof makeStoreModel>
		modals: ModalSystem
		setOp: (op: Op<void>) => void
	}): TierInteractivity | undefined {

	const {tierId} = tier

	switch (status) {
		case SubscriptionStatus.Unsubscribed: {
			const button = (
				!subscription
					? TierButton.Buy
					: (subscribedTierIndex > tierIndex)
						? TierButton.Downgrade
						: TierButton.Upgrade
			)
			if (isAnotherTierInPlanUnpaid)
				return undefined
			return {
				button,
				async action() {
					const actions = preparePurchaseActions({
						button,
						modals,
						storeModel,
						tier,
					})
					const scenario = determinePurchaseScenario({
						hasDefaultPaymentMethod: !!paymentMethod,
						hasExistingSubscription: !!subscription,
					})
					switch (scenario) {

						case PurchaseScenario.Update:
							return actions.upgradeOrDowngrade()

						case PurchaseScenario.UsePaymentMethod:
							return actions.buySubscriptionWithExistingPaymentMethod()

						case PurchaseScenario.CheckoutPopup:
							return ops.operation({
								setOp,
								promise: actions.buySubscriptionWithCheckoutPopup(),
							})

						default:
							throw new Error("unknown purchase scenario")
					}
				},
			}
		}
		case SubscriptionStatus.Active: {
			return {
				button: TierButton.Cancel,
				action: async() => modals.confirmAction({
					title: "Cancel subscription",
					message: `are you sure you want to cancel your ${tier.label} subscription`,
					loadingMessage: "cancelling subscription",
					actionWhenConfirmed: () => storeModel.subscriptions.cancel(tierId)
				}),
			}
		}
		case SubscriptionStatus.Unpaid: {
			return {
				button: TierButton.Pay,
				action: async() => ops.operation({
					promise: storeModel.billing.customerPortal(),
					setOp,
				}),
			}
		}
		case SubscriptionStatus.Cancelled: {
			return {
				button: TierButton.Renew,
				action: async() => await modals.confirmAction({
					title: "Renew subscription",
					message: `are you sure you want to renew your ${tier.label} subscription for $${centsToDollars(tier.pricing[0].price)}/month?`,
					loadingMessage: "renewing subscription",
					actionWhenConfirmed: () => storeModel.subscriptions.uncancel(tierId),
				})
			}
		}
		default:
			throw new Error("unknown subscription status")
	}
}
