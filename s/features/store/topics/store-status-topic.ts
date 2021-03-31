
import {asTopic} from "renraku/x/identities/as-topic.js"

import {StoreStatus} from "./types/store-status.js"
import {ProspectAuth} from "../api/policies/types/contexts/prosect-auth.js"
import {determineStoreStatus} from "./utils/determine-store-status.js"

export const storeStatusTopic = () => asTopic<ProspectAuth>()({

	async checkStoreStatus({tables, getStripeAccount}) {
		let storeStatus = StoreStatus.Uninitialized

		const row = await tables.merchant.stripeAccounts.one({
			conditions: false,
		})

		if (row) {
			const account = await getStripeAccount(row.stripeAccountId)
			storeStatus = await determineStoreStatus({account, tables})
		}

		return storeStatus
	},
})
