
export interface ConfigPlatform {
	legalLink: string
	technician: {
		email: string
	}
	appDetails: {
		appId: string
		label: string
		home: string
		origins: string[]
	}
}
