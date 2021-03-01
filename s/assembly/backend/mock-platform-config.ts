
import {PlatformConfig} from "./types/platform-config.js"
import {second, minute, day, year} from "../../toolbox/goodtimes/times.js"

import {hardPermissions} from "../../features/auth/permissions/hard-permissions.js"

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
		permissions: hardPermissions,
		platform: {
			from: `hello@${new URL(platformHome).hostname}`,
			technician: {
				email: technicianEmail,
			},
			appDetails: {
				appId: "402208a6d3295aad235c68cb20a35c30e835344bbc40fb398744c593b6aea076",
				label: platformLabel,
				home: platformHome,
				origins: [new URL(platformHome).origin],
			},
		},
		google: {
			clientId: "mock-google-token",
		},
		stripe: {
			apiKey: "mock-stripe-api-key",
			secret: "mock-stripe-secret",
			webhookSecret: "mock-stripe-webhook-secret",
		},
		tokens: {
			expiryRenewalCushion: 10 * second,
			lifespans: {
				app: 5 * minute,
				login: 20 * minute,
				refresh: 30 * day,
				access: 5 * minute,
				external: 10 * minute,
			}
		},
	}
}
