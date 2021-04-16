
import {asTopic} from "renraku/x/identities/as-topic.js"

import {StoreStatus} from "./types/store-status.js"
import {ProspectAuth} from "../api/policies/types/contexts/prosect-auth.js"
import {determineStoreStatus} from "./utils/determine-store-status.js"

export const statusCheckerTopic = () => asTopic<ProspectAuth>()({

	async getStoreStatus({tables, app, getStripeAccount}) {
		let storeStatus = StoreStatus.Uninitialized

		if (!app.platform) {
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
