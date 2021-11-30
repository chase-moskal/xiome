
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {StoreAuth, StoreMeta} from "../../types/store-metas-and-auths.js"

export const makeConnectService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreAuth>()({

	async policy(meta, request) {
		const auth = await options.storePolicy(meta, request)
		auth.checker.requirePrivilege("control store bank link")
		return auth
	},

	expose: {
		async loadConnectDetails() {},
		async generateConnectSetupLink() {},
		async disconnect() {},
	},
})
