
import * as dbmage from "dbmage"

import {StripeLiaison} from "../stripe/liaison/types.js"
import {StoreConnectTables} from "../database/types/schema.js"
import {StripeConnectDetails} from "../../isomorphic/concepts.js"

export async function fetchStripeConnectDetails({storeConnectTables, stripeLiaison}: {
		storeConnectTables: StoreConnectTables
		stripeLiaison: StripeLiaison
	}) {

	const active =
		await storeConnectTables
			.active
			.readOne({conditions: false})

	if (!active)
		return {
			connectDetails: undefined,
			connectId: undefined,
		}

	const account =
		await storeConnectTables
			.accounts
			.readOne(dbmage.find({connectId: active.connectId}))

	const connectDetails: StripeConnectDetails = {
		userId: account.userId.string,
		stripeAccountId: account.stripeAccountId,
		email: account.email,
		paused: account.paused,
		timeLinked: account.time,
		payouts_enabled: account.payouts_enabled,
		charges_enabled: account.charges_enabled,
		details_submitted: account.details_submitted,
	}

	return {
		connectDetails,
		connectId: active.connectId,
	}
}
