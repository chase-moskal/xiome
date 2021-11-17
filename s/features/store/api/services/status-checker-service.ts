
import {apiContext} from "renraku/x/api/api-context.js"

import {StoreStatus} from "./types/store-status.js"
import {StoreServiceOptions} from "../types/store-options.js"
import {determineStoreStatus} from "./utils/determine-store-status.js"
import {ProspectAuth, ProspectMeta} from "../policies/types/store-metas-and-auths.js"

export const makeStatusCheckerService = (
		options: StoreServiceOptions
	) => apiContext<ProspectMeta, ProspectAuth>()({

	policy: options.storePolicies.prospectPolicy,

	expose: {

		async getStoreStatus({access, storeTables, getStripeAccount}) {
			let storeStatus = StoreStatus.Uninitialized
	
			if (access.appId !== options.config.platform.appDetails.appId) {
				const row = await storeTables.merchant.stripeAccounts.one({
					conditions: false,
				})
		
				if (row) {
					const account = await getStripeAccount(row.stripeAccountId)
					storeStatus = await determineStoreStatus({account, storeTables})
				}
			}
	
			return storeStatus
		},
	},
})
