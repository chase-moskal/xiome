
import * as dbmage from "dbmage"

import {StoreDatabase} from "../../types/store-schema.js"
import {PermissionsInteractions} from "../../interactions/interactions-types.js"
import {fetchRoleIdsRelatedToSubscribedStripePriceIds} from "./utils/fetch-role-ids-related-to-subscribed-stripe-price-ids.js"

export async function fulfillSubscriptionRoles({
		userId,
		priceIds,
		storeDatabase,
		permissionsInteractions,
		timerange,
	}:{
		userId: dbmage.Id
		priceIds: string[]
		storeDatabase: StoreDatabase
		permissionsInteractions: PermissionsInteractions
		timerange: {
			timeframeStart: number
			timeframeEnd: number
		}
	}) {

	const {
		subscribedRoleIds,
		unsubscribedRoleIds,
	} = await fetchRoleIdsRelatedToSubscribedStripePriceIds(storeDatabase, priceIds)

	await permissionsInteractions.revokeUserRoles({
		userId,
		roleIds: unsubscribedRoleIds,
	})

	await permissionsInteractions.grantUserRoles({
		...timerange,
		userId,
		roleIds: subscribedRoleIds,
	})
}
