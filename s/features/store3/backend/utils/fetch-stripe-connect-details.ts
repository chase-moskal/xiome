
import * as dbmage from "dbmage"

import {StoreSchema} from "../database/types/schema.js"
import {StripeLiaison} from "../../../stripe/liaison/types.js"
import {StripeConnectDetails} from "../../isomorphic/concepts.js"

export async function fetchStripeConnectDetails({storeTables, stripeLiaison}: {
		storeTables: dbmage.SchemaToTables<StoreSchema>
		stripeLiaison: StripeLiaison
	}) {

	let connectDetails: StripeConnectDetails

	const ourRecordOfStripeAccount = await storeTables
		.merchants
		.readOne({conditions: false})

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
