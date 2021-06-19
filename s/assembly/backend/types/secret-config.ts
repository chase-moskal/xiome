
export interface SecretConfig {
	server: {
		port: number
	}
	email: "mock-console" | {
		sendgrid: {
			apiKey: string
		}
	}
	database: "mock-file" | "mock-memory" | {
		mongo: {
			link: string
			db: string
		}
	}
	platform: {
		from: string
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
	stripe: "mock-mode" | {
		apiKey: string
		secret: string
		webhookSecret: string
	}
	crypto: {
		keys: "mock-mode" | {
			private: string
			public: string
		}
		tokenLifespans: {
			login: number
			refresh: number
			access: number
			external: number
		}
	}
}
