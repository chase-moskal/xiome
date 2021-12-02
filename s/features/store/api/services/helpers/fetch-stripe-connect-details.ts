
import {StoreTables} from "../../../types/store-tables.js"
import {StripeConnectDetails, StripeLiaison} from "../../../types/store-concepts.js"

export async function fetchStripeConnectDetails({storeTables, stripeLiaison}: {
		storeTables: StoreTables
		stripeLiaison: StripeLiaison
	}) {

	let connectDetails: StripeConnectDetails

	const existingAssociatedStripeAccount = await storeTables
		.merchant.stripeAccounts.one({conditions: false})

	if (existingAssociatedStripeAccount) {
		const id = existingAssociatedStripeAccount.stripeAccountId
		const timeLinked = existingAssociatedStripeAccount.timeLinked
		const account = await stripeLiaison.accounts.retrieve(id)
		connectDetails = {
			email: account.email,
			stripeAccountId: account.id,
			charges_enabled: account.charges_enabled,
			payouts_enabled: account.payouts_enabled,
			details_submitted: account.details_submitted,
			timeLinked,
		}
	}

	return connectDetails
}
