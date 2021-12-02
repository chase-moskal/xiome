
import {StripeConnectDetails, StripeConnectStatus} from "../../../../types/store-concepts.js"

export function determineConnectStatus(
		details: undefined | StripeConnectDetails
	) {

	return details
		? isAccountReady(details)
			? StripeConnectStatus.Linked
			: StripeConnectStatus.LinkedButNotReady
		: StripeConnectStatus.Unlinked
}

function isAccountReady(details: StripeConnectDetails) {
	return details.details_submitted
		&& details.charges_enabled
		&& details.payouts_enabled
}
