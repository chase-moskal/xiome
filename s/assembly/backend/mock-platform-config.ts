
import {PlatformConfig} from "./types/platform-config.js"
import {minute, day} from "../../toolbox/goodtimes/times.js"

export function mockPlatformConfig({
		platformHome,
		platformLabel,
		technicianEmail,
	}: {
		platformHome: string
		platformLabel: string
		technicianEmail: string
	}): PlatformConfig {

	return {
		mongo: {
			link: "mock-mongo-link",
			database: "platform",
		},
		platform: {
			from: `hello@${new URL(platformHome).hostname}`,
			technician: {
				email: technicianEmail,
			},
			appDetails: {
				appId: "96bncPFrDyzJtXqPzHcmDTs7CFSc2SHkgTdZR5wHXCNST25H",
				label: platformLabel,
				home: platformHome,
				origins: [new URL(platformHome).origin],
			},
		},
		google: {
			clientId: "mock-google-token",
		},
		stripe: {
			apiKey: "pk_test_NEDtuftU6ziXyM4Y6PDrifPl00g6q5efYe",
			secret: "sk_test_Pj55B8JGeQyJeMxhcRc3ljEs00V9zwM3FA",
			webhookSecret: "mock-stripe-webhook-secret",
		},
		tokens: {
			lifespans: {
				login: 20 * minute,
				refresh: 30 * day,
				access: 5 * minute,
				external: 10 * minute,
			}
		},
	}
}
