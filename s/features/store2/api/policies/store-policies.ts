
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreApiOptions, StoreAuth, StoreMeta} from "../types.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"

export function makeStorePolicies(options: StoreApiOptions) {

	async function storePolicy(
			meta: StoreMeta,
			headers: renraku.HttpHeaders
		): Promise<StoreAuth> {
		const auth = await options.anonPolicy(meta, headers)
		return {
			...auth,
			storeDatabase: dbmage.subsection(auth.database, db => db.store),
			stripeLiaison: options.stripeLiaison,
		}
	}

	async function storeLinkedPolicy(
			meta: StoreMeta,
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
		const stripeLiaisonAccount = options.stripeLiaison
			.account(connectDetails.stripeAccountId)
		return {
			...auth,
			stripeLiaisonAccount,
			stripeAccountId: connectDetails.stripeAccountId,
		}
	}

	async function storeCustomerPolicy(
			meta: StoreMeta,
			headers: renraku.HttpHeaders,
		) {
		const auth = await storeLinkedPolicy(meta, headers)

		if (!auth.access.user) {
			throw new renraku.ApiError(400, "user is not logged in")
		}

		const userId = dbmage.Id.fromString(auth.access.user.userId)
		let customerRow = await auth.storeDatabase.tables.billing
			.customers.readOne(dbmage.find({userId}))
		if (!customerRow) {
			const {id: stripeCustomerId} = await auth.stripeLiaisonAccount.customers.create({})
			customerRow = {
				userId,
				stripeCustomerId,
			}
			await auth.storeDatabase.tables.billing.customers.create(customerRow)
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
