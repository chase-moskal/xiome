
import {Service} from "../../../../types/service.js"
import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
import {stripeAccountsTopic} from "../../topics/stripe-accounts-topic.js"

export function stripeLinkModel({
			stripeAccountsService,
			getAccess,
		}: {
			stripeAccountsService: Service<typeof stripeAccountsTopic>
			getAccess: () => Promise<AccessPayload>
		}) {

	return {
		async fetchDetails(appId: string) {
			return stripeAccountsService.getStripeAccountDetails()
		},
	}
}
