
import {makeStoreModel} from "../../../models/store-model.js"
import {SubscriptionTier} from "../../../types/store-concepts.js"
import {centsToDollars} from "../../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export function preparePurchaseActions({
		modals, buttonLabel, tier, storeModel
	}:{
		modals: ModalSystem
		buttonLabel: string
		tier: SubscriptionTier
		storeModel: ReturnType<typeof makeStoreModel>
	}) {

	const {tierId} = tier
	const {subscriptions} = storeModel

	return {
		upgradeOrDowngrade: async () => {
			await modals.confirmAction({
				title: buttonLabel,
				message: `are you sure you want to ${buttonLabel} your subscription to ${tier.label} for $${centsToDollars(tier.pricing.price)}/month?`,
				actionWhenConfirmed: () => subscriptions.purchase({
					tierId, showLoadingSpinner: true
				}),
				loadingMessage: `switching to ${tier.label}`
			})
		},

		buySubscriptionWithCheckoutPopup: async () => {
			await subscriptions.purchase({tierId})
		},

		buySubscriptionWithExistingPaymentMethod: async () => {
			await modals.confirmAction({
				title: `${buttonLabel} subscription`,
				message: `are you sure you want to ${buttonLabel} ${tier.label} for $${centsToDollars(tier.pricing.price)}/month?`,
				actionWhenConfirmed: () => subscriptions.purchase({tierId}),
				loadingMessage: `purchasing subscription`
			})
		}
	}
}
