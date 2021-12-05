
import {StoreTables} from "../../../types/store-tables.js"
import {StripeConnectDetails, StripeLiaison} from "../../../types/store-concepts.js"

export async function fetchStripeConnectDetails({storeTables, stripeLiaison}: {
		storeTables: StoreTables
		stripeLiaison: StripeLiaison
	}) {

	let connectDetails: StripeConnectDetails

	const ourRecordOfStripeAccount = await storeTables
		.merchant.stripeAccounts.one({conditions: false})

	if (ourRecordOfStripeAccount) {
		const id = ourRecordOfStripeAccount.stripeAccountId
		const timeLinked = ourRecordOfStripeAccount.time
		const stripeRecordOfAccount = await stripeLiaison.accounts.retrieve(id)
		connectDetails = {
			timeLinked,
			email: stripeRecordOfAccount.email,
			paused: ourRecordOfStripeAccount.paused,
			stripeAccountId: stripeRecordOfAccount.id,
			charges_enabled: stripeRecordOfAccount.charges_enabled,
			payouts_enabled: stripeRecordOfAccount.payouts_enabled,
			details_submitted: stripeRecordOfAccount.details_submitted,
		}
	}

	return connectDetails
}
