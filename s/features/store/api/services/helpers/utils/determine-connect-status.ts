
import {StripeConnectDetails, StripeConnectStatus} from "../../../../types/store-concepts.js"

export function determineConnectStatus(
		details: undefined | StripeConnectDetails
	) {

	return details
		? (details.details_submitted && details.payouts_enabled)
			? StripeConnectStatus.Linked
			: StripeConnectStatus.LinkedButNotReady
		: StripeConnectStatus.Unlinked
}
