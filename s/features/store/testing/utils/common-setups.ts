
import {storeTestSetup} from "./store-test-setup.js"

export const setups = {

	async connectedStore() {
		const api = await storeTestSetup()
			.then(x => x.api())

		const merchant = await api
			.client(api.roles.merchant)
			.then(x => x.browserTab())

		await merchant
			.store
			.connect
			.stripeAccountOnboarding()

		return {api, merchant}
	},
}
