
import {PlatformConfig} from "../auth-types.js"
import {Rando} from "../../../toolbox/get-rando.js"
import {second, minute, day} from "../../../toolbox/timely.js"

export function mockPlatformConfig({rando}: {rando: Rando}): PlatformConfig {
	return {
		mongo: {
			link: "mock-mongo-link",
			database: "platform",
		},
		google: {
			clientId: "mock-google-token",
		},
		platform: {
			from: "hello@feature.farm",
			technician: {
				email: "chasemoskal@gmail.com",
			},
			app: {
				appId: rando.randomId(),
				platform: true,
				label: "feature.farm",
				home: "https://feature.farm",
				origins: [
					"https://feature.farm",
				],
			},
		},
		stripe: {
			apiKey: "mock-stripe-api-key",
			secret: "mock-stripe-secret",
			webhookSecret: "mock-stripe-webhook-secret",
		},
		tokens: {
			expiryRenewalCushion: 10 * second,
			lifespans: {
				app: 30 * day,
				login: 5 * minute,
				refresh: 30 * day,
				access: 20 * minute,
				external: 10 * minute,
			}
		},
	}
}
