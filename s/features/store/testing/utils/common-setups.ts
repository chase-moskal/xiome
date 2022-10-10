
import {storeTestSetup} from "./store-test-setup.js"

export const setups = {

	async linkedStore() {
		const api = await storeTestSetup()
			.then(x => x.api())

		const merchant = await api
			.client(api.roles.merchant)
			.then(x => x.browserTab())

		await merchant
			.store
			.connect
			.connectStripeAccount()

		return {api, merchant}
	},
}
