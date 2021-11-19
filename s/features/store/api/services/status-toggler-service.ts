
import {apiContext} from "renraku/x/api/api-context.js"

import {StoreServiceOptions} from "../types/store-options.js"
import {StoreAuth, StoreMeta} from "../policies/types/store-metas-and-auths.js"

export const makeStatusTogglerService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreAuth>()({

	policy: options.storePolicy,

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
