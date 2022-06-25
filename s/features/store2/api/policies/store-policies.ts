
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreApiOptions} from "../types.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {determineConnectStatus} from "../services/helpers/utils/determine-connect-status.js"
import {fetchStripeConnectDetails} from "../services/helpers/fetch-stripe-connect-details.js"

export function makeStorePolicies<xMeta>({
		stripeLiaison,
		storePolicy,
	}: StoreApiOptions) {

	// async function storePolicy(
	// 		meta: StoreMeta,
	// 		headers: renraku.HttpHeaders
	// 	): Promise<StoreAuth> {
	// 	const auth = await options.anonPolicy(meta, headers)
	// 	return {
	// 		...auth,
	// 		stripeLiaison: options.stripeLiaison,
	// 		storeDatabase: dbmage.subsection(auth.database, tables => tables.store),
	// 		permissionsInteractions: makePermissionsInteractions({
	// 			generateId: options.generateId,
	// 			database: dbmage.subsection(auth.database, tables => ({
	// 				role: tables.auth.permissions.role,
	// 				userHasRole: tables.auth.permissions.userHasRole,
	// 			})),
	// 		}),
	// 	}
	// }

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
