
import {asTopic} from "renraku/x/identities/as-topic.js"

import {StoreStatus} from "./types/store-status.js"
import {determineStoreStatus} from "./utils/determine-store-status.js"
import {ProspectAuth} from "../api/policies/types/contexts/prosect-auth.js"
import {PlatformConfig} from "../../../assembly/backend/types/platform-config.js"

export const statusCheckerTopic = ({config}: {
		config: PlatformConfig
	}) => asTopic<ProspectAuth>()({

	async getStoreStatus({tables, access, getStripeAccount}) {
		let storeStatus = StoreStatus.Uninitialized

		if (access.appId !== config.platform.appDetails.appId) {
			const row = await tables.merchant.stripeAccounts.one({
				conditions: false,
			})
	
			if (row) {
				const account = await getStripeAccount(row.stripeAccountId)
				storeStatus = await determineStoreStatus({account, tables})
			}
		}

		return storeStatus
	},
})
