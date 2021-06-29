
import {ConfigKeys} from "./config-keys.js"
import {ConfigStripe} from "./config-stripe.js"
import {ConfigPlatform} from "./config-platform.js"
import {ConfigDatabaseMongo} from "./config-database-mongo.js"
import {ConfigEmailSendgrid} from "./config-email-sendgrid.js"

export interface SecretConfig {
	server: {
		port: number
	}
	platform: ConfigPlatform
	email: "mock-console" | ConfigEmailSendgrid
	database: "mock-file" | "mock-memory" | "mock-localstorage" | ConfigDatabaseMongo
	stripe: "mock-mode" | ConfigStripe
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
