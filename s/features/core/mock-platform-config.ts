
import {PlatformConfig} from "./core-types.js"
import {Rando} from "../../toolbox/get-rando.js"

export function mockPlatformConfig({rando, technician}: {
			rando: Rando
			technician: PlatformConfig["platform"]["technician"]
		}): PlatformConfig {
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
		platform: {
			technician,
			app: {
				appId: rando.randomId(),
				origins: [
					"localhost:8080",
				],
			},
		},
		stripe: {
			apiKey: "mock-stripe-api-key",
			secret: "mock-stripe-secret",
			webhookSecret: "mock-stripe-webhook-secret",
		},
		tokens: {
			lifespans: {
				app: 30 * day,
				refresh: 30 * day,
				access: 20 * minute,
				external: 10 * minute,
			}
		},
	}
}
