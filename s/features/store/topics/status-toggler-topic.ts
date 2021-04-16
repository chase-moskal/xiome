
import {asTopic} from "renraku/x/identities/as-topic.js"
import {ClerkAuth} from "../api/policies/types/contexts/clerk-auth.js"

export const statusTogglerTopic = () => asTopic<ClerkAuth>()({

	async enableEcommerce({tables}) {
		await tables.billing.storeInfo.update({
			conditions: false,
			upsert: {ecommerceActive: true},
		})
	},

	async disableEcommerce({tables}) {
		await tables.billing.storeInfo.update({
			conditions: false,
			upsert: {ecommerceActive: false},
		})
	},
})
