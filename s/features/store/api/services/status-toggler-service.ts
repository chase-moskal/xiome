
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../types/store-options.js"
import {ClerkAuth, ClerkMeta} from "../policies/types/store-metas-and-auths.js"

export const makeStatusTogglerService = (
		options: StoreServiceOptions
	) => apiContext<ClerkMeta, ClerkAuth>()({

	policy: options.storePolicies.clerkPolicy,

	expose: {

		async enableEcommerce({storeTables}) {
			await storeTables.billing.storeInfo.update({
				conditions: false,
				upsert: {ecommerceActive: true},
			})
		},
	
		async disableEcommerce({storeTables}) {
			await storeTables.billing.storeInfo.update({
				conditions: false,
				upsert: {ecommerceActive: false},
			})
		},
	},
})
