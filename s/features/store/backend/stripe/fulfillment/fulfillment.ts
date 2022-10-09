
import * as dbmage from "dbmage"

import {StripeLiaisonAccount} from "../liaison/types.js"
import {StoreDatabase} from "../../database/types/schema.js"
import {fetchRoleIdsRelatedToSubscribedStripePriceIds} from "./utils/fetch-role-ids-related-to-subscribed-stripe-price-ids.js"
import {RoleManager} from "../../../../auth/aspects/permissions/interactions/types.js"

export async function fulfillSubscriptionRoles({
		userId,
		priceIds,
		storeDatabase,
		stripeLiaisonAccount,
		roleManager,
		timerange,
	}:{
		userId: dbmage.Id
		priceIds: string[]
		storeDatabase: StoreDatabase
		stripeLiaisonAccount: StripeLiaisonAccount
		roleManager: RoleManager
		timerange: {
			timeframeStart: number
			timeframeEnd: number
		}
	}) {

	const {
		subscribedRoleIds,
		unsubscribedRoleIds,
	} = await fetchRoleIdsRelatedToSubscribedStripePriceIds({
		storeDatabase,
		stripeLiaisonAccount,
		stripePriceIds: priceIds,
	})

	await roleManager.revokeUserRoles({
		userId,
		roleIds: unsubscribedRoleIds,
	})

	await roleManager.grantUserRoles({
		...timerange,
		userId,
		roleIds: subscribedRoleIds,
	})
}
