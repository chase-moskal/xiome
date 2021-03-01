
import {HardPermissions} from "./hard-permissions.js"

export interface PlatformConfig {
	mongo: {
		link: string
		database: string
	}
	google: {
		clientId: string
	}
	platform: {
		appDetails: {
			appId: string
			label: string
			home: string
			origins: string[]
		}
		from: string
		technician: {
			email: string
		}
	}
	permissions: {
		app: HardPermissions
		platform: HardPermissions
	}
	tokens: {
		expiryRenewalCushion: number
		lifespans: {
			app: number
			login: number
			access: number
			refresh: number
			external: number
		}
	}
	stripe: {
		apiKey: string
		secret: string
		webhookSecret: string
	}
}
