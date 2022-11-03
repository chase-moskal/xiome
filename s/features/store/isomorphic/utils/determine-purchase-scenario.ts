
import {PurchaseScenario} from "../concepts.js"

export function determinePurchaseScenario({
		hasDefaultPaymentMethod, hasExistingSubscription
	}: {
		hasDefaultPaymentMethod: boolean
		hasExistingSubscription: boolean
	}): PurchaseScenario {

	if (hasExistingSubscription)
		return PurchaseScenario.Update

	else {
		if (hasDefaultPaymentMethod)
			return PurchaseScenario.UsePaymentMethod

		else
			return PurchaseScenario.CheckoutPopup
	}
}
