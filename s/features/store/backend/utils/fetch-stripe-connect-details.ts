
import * as dbmage from "dbmage"

import {StripeConnectDetails} from "../../isomorphic/concepts.js"
import {StoreDatabaseUnconnected} from "../database/types/schema.js"

export async function fetchStripeConnectDetails({storeDatabaseUnconnected}: {
		storeDatabaseUnconnected: StoreDatabaseUnconnected
	}) {

	const active =
		await storeDatabaseUnconnected
			.tables
			.connect
			.active
			.readOne({conditions: false})

	if (!active)
		return {
			connectDetails: undefined,
			connectId: undefined,
		}

	const account =
		await storeDatabaseUnconnected
			.tables
			.connect
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
