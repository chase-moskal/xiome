
import {configureApi} from "./configure-api.js"
import {SecretConfig} from "./types/secret-config.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"

export async function mockBackend(config: SecretConfig) {

	const {
		api,
		emails,
		database,
		stripeComplex,
		mockStripeOperations,
	} = await configureApi(config)

	return {
		api,
		config,
		emails,
		database,
		stripeComplex,
		mockStripeOperations,
		platformAppId: config.platform.appDetails.appId,
		mockBrowser: async() => mockBrowser({
			api,
			mockStripeOperations,
		}),
	}
}
