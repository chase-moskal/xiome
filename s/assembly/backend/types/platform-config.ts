
import {HardPermissions} from "../permissions/types/hard-permissions.js"

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
		lifespans: {
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
