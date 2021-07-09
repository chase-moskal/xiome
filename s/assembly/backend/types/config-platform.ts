
export interface ConfigPlatform {
	legalLink: string
	technician: {
		email: string
	}
	appDetails: {
		id_app: string
		label: string
		home: string
		origins: string[]
	}
}
