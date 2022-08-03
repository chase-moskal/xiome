
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
			type Result = Popups.Result & {status: "return" | "refresh"}
			return openPopupAndWaitForResult<Result>({
				popupId,
				url: stripeAccountSetupLink,
				async handleSecretMockCommand(command: Popups.SecretMockCommand) {
					if (command.type === "incomplete")
						await mockStripeOperations.linkStripeAccountThatIsIncomplete(stripeAccountId)
					else if (command.type === "complete")
						await mockStripeOperations.linkStripeAccount(stripeAccountId)
				},
			})
		},
		async login({url, stripeAccountId}: {
				url: string
				stripeAccountId: string
			}): Promise<void> {
			// TODO login popup
			throw new Error("TODO login popup")
			// await openPopupAndWaitForResult()
		},
		async checkout({popupId, stripeSessionUrl}: {
				popupId: string
				stripeSessionId: string
				stripeAccountId: string
				stripeSessionUrl: string
			}) {
			return openPopupAndWaitForResult({
				popupId,
				url: stripeSessionUrl,
				width: 260,
				height: 260,
			})
		},
	}
}
