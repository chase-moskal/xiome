
import {makeStoreModel} from "../../../model/model.js"
import {SubscriptionTier} from "../../../../isomorphic/concepts.js"
import {centsToDollars} from "../../subscription-planning/ui/price-utils.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"

export function preparePurchaseActions({
		modals, buttonLabel, tier, storeModel
	}:{
		modals: ModalSystem
		buttonLabel: string
		tier: SubscriptionTier
		storeModel: ReturnType<typeof makeStoreModel>
	}) {

	const {subscriptions} = storeModel
	const {stripePriceId} = tier.pricing[0]

	return {

		upgradeOrDowngrade: async () => {
			await modals.confirmAction({
				title: buttonLabel,
				message: `are you sure you want to ${buttonLabel} your subscription to ${tier.label} for $${centsToDollars(tier.pricing[0].price)}/month?`,
				actionWhenConfirmed: () => subscriptions.purchase({
					stripePriceId,
					showLoadingSpinner: true,
				}),
				loadingMessage: `switching to ${tier.label}`
			})
		},

		buySubscriptionWithCheckoutPopup: async () => {
			await subscriptions.purchase({stripePriceId})
		},

		buySubscriptionWithExistingPaymentMethod: async () => {
			await modals.confirmAction({
				title: `${buttonLabel} subscription`,
				message: `are you sure you want to ${buttonLabel} ${tier.label} for $${centsToDollars(tier.pricing[0].price)}/month?`,
				actionWhenConfirmed: () => subscriptions.purchase({stripePriceId}),
				loadingMessage: `purchasing subscription`
			})
		}
	}
}
