
import {PlatformConfig} from "../auth-types.js"
import {second, minute, day} from "../../../toolbox/goodtimes/times.js"

import {hardPermissions} from "../permissions/hard-permissions.js"

export function mockPlatformConfig({
		platformLink,
		technicianEmail,
		platformAppLabel,
	}: {
		platformLink: string
		technicianEmail: string
		platformAppLabel: string
	}): PlatformConfig {

	return {
		mongo: {
			link: "mock-mongo-link",
			database: "platform",
		},
		permissions: hardPermissions,
		platform: {
			from: `hello@${new URL(platformLink).hostname}`,
			technician: {
				email: technicianEmail,
			},
			appDetails: {
				appId: "402208a6d3295aad235c68cb20a35c30e835344bbc40fb398744c593b6aea076",
				label: platformAppLabel,
				home: platformLink,
				origins: [new URL(platformLink).origin],
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
				app: 30 * day,
				login: 5 * minute,
				refresh: 30 * day,
				access: 20 * minute,
				external: 10 * minute,
			}
		},
	}
}
