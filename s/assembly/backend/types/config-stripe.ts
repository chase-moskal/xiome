
export interface ConfigStripe {
	webhookServer: {
		port: number
	}
	keys: {
		publishable: string
		secret: string
		webhookEndpointSecret: string
	}
}
