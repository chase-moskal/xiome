
import * as dbmage from "dbmage"

import {StripeLiaisonAccount} from "../liaison/types.js"
import {StoreDatabase} from "../../types/store-schema.js"
import {PermissionsInteractions} from "../../interactions/interactions-types.js"
import {fetchRoleIdsRelatedToSubscribedStripePriceIds} from "./utils/fetch-role-ids-related-to-subscribed-stripe-price-ids.js"

export async function fulfillSubscriptionRoles({
		userId,
		priceIds,
		storeDatabase,
		stripeLiaisonAccount,
		permissionsInteractions,
		timerange,
	}:{
		userId: dbmage.Id
		priceIds: string[]
		storeDatabase: StoreDatabase
		stripeLiaisonAccount: StripeLiaisonAccount
		permissionsInteractions: PermissionsInteractions
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
