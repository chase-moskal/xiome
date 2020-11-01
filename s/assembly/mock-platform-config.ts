
import {Rando} from "../toolbox/get-rando.js"
import {PlatformConfig} from "../features/core/core-types.js"

export function mockPlatformConfig({rando}: {rando: Rando}): PlatformConfig {
	const minute = 1000 * 60
	const day = minute * 60 * 24
	return {
		mongo: {
			link: "mock-mongo-link",
			database: "platform",
		},
		google: {
			clientId: "mock-google-token",
		},
		platformApp: {
			appId: rando.randomId(),
			root: true,
			origins: [
				"localhost:8080",
			],
		},
		stripe: {
			apiKey: "mock-stripe-api-key",
			secret: "mock-stripe-secret",
			webhookSecret: "mock-stripe-webhook-secret",
		},
		tokens: {
			lifespans: {
				refresh: 30 * day,
				access: 20 * minute,
				outsideAccess: 10 * minute,
			}
		},
	}
}
