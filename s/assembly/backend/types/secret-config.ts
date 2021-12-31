
import {ConfigKeys} from "./config-keys.js"
import {ConfigStripe} from "./config-stripe.js"
import {ConfigPlatform} from "./config-platform.js"
import {ConfigEmailMailgun} from "./config-email-mailgun.js"
import {ConfigDatabaseMongo} from "./config-database-mongo.js"

export interface SecretConfig {
	server: {
		port: number
		detailedLogs: boolean
	}
	platform: ConfigPlatform
	email: "mock-console" | ConfigEmailMailgun
	database: "mock-storage" | ConfigDatabaseMongo
	stripe: "mock-mode" | ConfigStripe
	dacast: "mock-mode" | true
	chat: {
		port: number
	}
	crypto: {
		keys: "mock-mode" | "environment-variables" | ConfigKeys
		tokenLifespans: {
			login: number
			refresh: number
			access: number
			external: number
		}
	}
}
