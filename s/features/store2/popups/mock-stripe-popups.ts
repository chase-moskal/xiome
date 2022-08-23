
import {Popups} from "./types.js"
import {MockStripeOperations} from "../stripe/types.js"
import {openPopupAndWaitForResult} from "./popup-core/open-popup-and-wait-for-result.js"

export function mockStripePopups({mockStripeOperations}: {
		mockStripeOperations: MockStripeOperations
	}) {
	return {

		async connect({popupId, stripeAccountId, stripeAccountSetupLink}: {
				popupId: string
				stripeAccountId: string
				stripeAccountSetupLink: string
			}) {
			return openPopupAndWaitForResult<{status: "return" | "refresh"}>({
				popupId,
				url: stripeAccountSetupLink,
				async handleSecretMockCommand(command: Popups.SecretMockCommand) {
					if (command.type === "complete")
						await mockStripeOperations.linkStripeAccount(stripeAccountId)
					else if (command.type === "incomplete")
						await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
				},
			})
		},

		async login({popupId, stripeAccountId, stripeLoginLink}: {
				popupId: string
				stripeAccountId: string
				stripeLoginLink: string
			}) {
			return openPopupAndWaitForResult<void>({
				popupId,
				url: stripeLoginLink,
				async handleSecretMockCommand(command: Popups.SecretMockCommand) {
					if (command.type === "complete")
						await mockStripeOperations.linkStripeAccount(stripeAccountId)
					else if (command.type === "incomplete")
						await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
				},
			})
		},


		// TODO - should we checkout a subscription at all when the payment method fails??
		async checkoutSubscription({popupId, stripeSessionUrl, stripeSessionId, stripeAccountId}: {
				popupId: string
				stripeSessionId: string
				stripeAccountId: string
				stripeSessionUrl: string
			}) {
			return openPopupAndWaitForResult<{status: "success" | "cancel"}>({
				popupId,
				url: stripeSessionUrl,
				async handleSecretMockCommand(command: Popups.SecretMockCommand) {
					if (command.type === "success")
						await mockStripeOperations.checkoutSubscriptionTier(stripeAccountId, stripeSessionId)
				},
			})
		},

		async checkoutPaymentMethod({popupId, stripeSessionUrl, stripeSessionId, stripeAccountId}: {
				popupId: string
				stripeSessionId: string
				stripeAccountId: string
				stripeSessionUrl: string
			}) {
			return openPopupAndWaitForResult<{status: "success" | "cancel"}>({
				popupId,
				url: stripeSessionUrl,
				async handleSecretMockCommand(command: Popups.SecretMockCommand) {
					if (command.type === "success"){
						const isFailing = false
						await mockStripeOperations.completePaymentMethodCheckout(
							stripeAccountId, stripeSessionId, isFailing
						)
					}
					else if (command.type === "failure"){
						const isFailing = true
						await mockStripeOperations.completePaymentMethodCheckout(
							stripeAccountId, stripeSessionId, isFailing
						)
					}
				},
			})
		},

		async openStoreCustomerPortal(popupId: string, url: string) {
			return openPopupAndWaitForResult({
				popupId,
				url,
			})
		}
	}
}
