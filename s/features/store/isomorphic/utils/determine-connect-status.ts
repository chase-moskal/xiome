
import {StripeConnectDetails, StripeConnectStatus} from "../concepts.js"

export function determineConnectStatus(
		details: undefined | StripeConnectDetails
	) {

	return details
		? isStripeAccountComplete(details)
			? details.paused
				? StripeConnectStatus.Paused
				: StripeConnectStatus.Ready
			: StripeConnectStatus.Incomplete
		: StripeConnectStatus.Unlinked
}

function isStripeAccountComplete(details: StripeConnectDetails) {
	return details.details_submitted
		&& details.charges_enabled
}
