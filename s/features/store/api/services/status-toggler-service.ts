
import {apiContext} from "renraku/x/api/api-context.js"

import {StoreServiceOptions} from "../types/store-options.js"
import {StoreAuth, StoreMeta} from "../types/store-metas-and-auths.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"

export const makeStatusTogglerService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreAuth>()({

	async policy(meta, request) {
		const auth = await options.storePolicy(meta, request)
		auth.checker.requirePrivilege("manage store")
		return auth
	},

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
