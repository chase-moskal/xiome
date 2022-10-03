
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreApiOptions} from "../types.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"
import {fetchStripeConnectDetails} from "../utils/fetch-stripe-connect-details.js"
import {determineConnectStatus} from "../../isomorphic/utils/determine-connect-status.js"

export function makeStorePolicies<xMeta>({
		stripeLiaison,
		storePolicy,
	}: StoreApiOptions) {

	async function storeLinkedPolicy(
			meta: xMeta,
			headers: renraku.HttpHeaders,
		) {
		const auth = await storePolicy(meta, headers)
		const connectDetails = await fetchStripeConnectDetails({
			storeTables: auth.storeDatabase.tables,
			stripeLiaison: auth.stripeLiaison,
		})
		const connectStatus = determineConnectStatus(connectDetails)
		if (connectStatus !== StripeConnectStatus.Ready)
			throw new renraku.ApiError(
				400,
				"stripe account is not connected, and this action requires it"
			)
		const stripeLiaisonAccount = stripeLiaison
			.account(connectDetails.stripeAccountId)
		return {
			...auth,
			stripeLiaisonAccount,
			stripeAccountId: connectDetails.stripeAccountId,
		}
	}

	async function storeCustomerPolicy(
			meta: xMeta,
			headers: renraku.HttpHeaders,
		) {
		const auth = await storeLinkedPolicy(meta, headers)

		if (!auth.access.user) {
			throw new renraku.ApiError(400, "user is not logged in")
		}

		const userId = dbmage.Id.fromString(auth.access.user.userId)

		let customerRow = await auth
			.storeDatabase
			.tables
			.customers
			.readOne(dbmage.find({userId}))

		if (!customerRow) {
			const {id: stripeCustomerId} = await auth.stripeLiaisonAccount.customers.create({})
			customerRow = {
				userId,
				stripeCustomerId,
			}
			await auth.storeDatabase.tables.customers.create(customerRow)
		}
		const {stripeCustomerId} = customerRow

		return {
			...auth,
			stripeCustomerId,
		}
	}

	return {
		storePolicy,
		storeLinkedPolicy,
		storeCustomerPolicy,
	}
}
