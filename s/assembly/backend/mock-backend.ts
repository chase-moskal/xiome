
import {mockConfig} from "./mock-config.js"
import {configureApi} from "./configure-api.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"

export async function mockBackend() {

	const {
		api,
		emails,
		database,
		stripeComplex,
		mockStripeOperations,
	} = await configureApi(mockConfig)

	return {
		api,
		emails,
		database,
		stripeComplex,
		config: mockConfig,
		mockStripeOperations,
		platformAppId: mockConfig.platform.appDetails.appId,
		mockBrowser: async() => mockBrowser({
			api,
			mockStripeOperations,
		}),
	}
}
