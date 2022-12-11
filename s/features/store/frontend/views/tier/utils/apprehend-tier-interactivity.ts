
import {makeStoreModel, StoreModel} from "../../../model/model.js"
import {Op, ops} from "../../../../../../framework/ops.js"
import {TierBasics, TierButton, TierContext, TierInteractivity} from "../types.js"
import {centsToDollars} from "../../../components/subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"
import {determinePurchaseScenario} from "../../../../isomorphic/utils/determine-purchase-scenario.js"
import {PaymentMethod, PurchaseScenario, SubscriptionStatus} from "../../../../isomorphic/concepts.js"
import {preparePurchaseActions} from "../../../components/subscription-catalog/utils/subscription-actions.js"

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
		paymentMethod,
		billing,
		subscriptions,
		setOp,
	}: {
		basics: TierBasics
		modals: ModalSystem
		context: TierContext
		paymentMethod: PaymentMethod
		billing: StoreModel["billing"]
		subscriptions: StoreModel["subscriptions"]
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
						tier,
						button,
						modals,
						subscriptions,
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
					actionWhenConfirmed: () => subscriptions.cancel(tierId)
				}),
			}
		}
		case SubscriptionStatus.Unpaid: {
			return {
				button: TierButton.Pay,
				action: async() => ops.operation({
					promise: billing.customerPortal(),
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
					actionWhenConfirmed: () => subscriptions.uncancel(tierId),
				})
			}
		}
		default:
			throw new Error("unknown subscription status")
	}
}
