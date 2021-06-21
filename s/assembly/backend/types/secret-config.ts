
export interface SecretConfig {
	server: {
		port: number
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
	email: "mock-console" | {
		sendgrid: {
			apiKey: string
		}
	}
	database: "mock-file" | "mock-memory" | "mock-localstorage" | {
		mongo: {
			link: string
			db: string
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
