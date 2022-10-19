
import {makeStoreModel} from "../model/model.js"
import {Op, ops} from "../../../../framework/ops.js"
import {centsToDollars} from "../components/subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {determinePurchaseScenario} from "../../isomorphic/utils/determine-purchase-scenario.js"
import {preparePurchaseActions} from "../components/subscription-catalog/utils/subscription-actions.js"
import {PurchaseScenario, SubscriptionDetails, SubscriptionStatus, SubscriptionTier} from "../../isomorphic/concepts.js"

export interface TierDetails {
	tierIndex: number
	modals: ModalSystem
	tier: SubscriptionTier
	subscription: SubscriptionDetails
	subscriptions: SubscriptionDetails[]
	subscribedTierIndex: number | undefined
	storeModel: ReturnType<typeof makeStoreModel>
	setOp(op: Op<any>): void
}

export interface TierInfo {
	stateLabel: string
	buttonLabel: string
	action: () => Promise<void>
}

export function apprehendTierInfo({
		tier,
		modals,
		tierIndex,
		storeModel,
		subscription,
		subscriptions,
		subscribedTierIndex,
		setOp,
	}: TierDetails): TierInfo | undefined {

	const {tierId} = tier
	const isSubscribedToThisTier = tierIndex === subscribedTierIndex
	const noExistingSubscriptionForPlan = subscribedTierIndex === undefined
	const tierSubscription = subscriptions.find(
		subscription => subscription.tierId === tierId
	)
	const subscriptionStatus = tierSubscription?.status
		?? SubscriptionStatus.Unsubscribed
	const isAnotherTierInPlanUnpaid = (
		subscription
		&& !isSubscribedToThisTier
		&& subscription.status === SubscriptionStatus.Unpaid
	)

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
							storeModel,
							modals,
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
									setOp,
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
					await modals.confirmAction({
						title: "Cancel subscription",
						message: `are you sure you want to cancel your ${tier.label} subscription`,
						loadingMessage: "cancelling subscription",
						actionWhenConfirmed: () => storeModel.subscriptions.cancel(tierId)
					})
				},
			}

		case SubscriptionStatus.Unpaid:
			return {
				stateLabel: "payment failed",
				buttonLabel: "update now",
				action: async() => await ops.operation({
					promise: storeModel.billing.customerPortal(),
					setOp,
				}),
			}

		case SubscriptionStatus.Cancelled:
			return {
				stateLabel: "cancelled",
				buttonLabel: "renew",
				action: async () => {
					await modals.confirmAction({
						title: "Renew subscription",
						message: `are you sure you want to renew your ${tier.label} subscription for $${centsToDollars(tier.pricing[0].price)}/month?`,
						loadingMessage: "renewing subscription",
						actionWhenConfirmed: () => storeModel.subscriptions.uncancel(tierId),
					})
				},
			}

		default:
			throw new Error("unknown subscription status")
	}
}
