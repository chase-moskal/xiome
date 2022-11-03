
import {makeStoreModel} from "../../../model/model.js"
import {SubscriptionTier} from "../../../../isomorphic/concepts.js"
import {centsToDollars} from "../../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"
import {TierButton} from "../../../views/tier/types.js"

export function preparePurchaseActions({
		modals, button, tier, storeModel
	}:{
		button: TierButton
		modals: ModalSystem
		tier: SubscriptionTier
		storeModel: ReturnType<typeof makeStoreModel>
	}) {

	const {subscriptions} = storeModel
	const {stripePriceId} = tier.pricing[0]

	return {

		upgradeOrDowngrade: async () => {
			const label = button === TierButton.Upgrade
				? "upgrade"
				: "downgrade"
			await modals.confirmAction({
				title: button === TierButton.Upgrade
					? "upgrade subscription"
					: "downgrade subscription",
				message: `are you sure you want to ${label} your subscription to ${tier.label} for $${centsToDollars(tier.pricing[0].price)}/month?`,
				loadingMessage: `switching to ${tier.label}`,
				actionWhenConfirmed: () => subscriptions.purchase({
					stripePriceId,
					showLoadingSpinner: true,
				}),
			})
		},

		buySubscriptionWithCheckoutPopup: async () => {
			await subscriptions.purchase({stripePriceId})
		},

		buySubscriptionWithExistingPaymentMethod: async () => {
			await modals.confirmAction({
				title: `buy subscription`,
				message: `are you sure you want to buy ${tier.label} for $${centsToDollars(tier.pricing[0].price)}/month?`,
				actionWhenConfirmed: () => subscriptions.purchase({stripePriceId}),
				loadingMessage: `purchasing subscription`
			})
		}
	}
}
