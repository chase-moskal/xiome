
import {SecretConfig} from "./types/secret-config.js"
import {day, minute} from "../../toolbox/goodtimes/times.js"

export const mockConfig = ({platformHome, platformOrigins}: {
		platformHome: string
		platformOrigins: string[]
	}): SecretConfig => ({
	server: {
		port: 4999,
		detailedLogs: true,
	},
	platform: {
		legalLink: "https://xiome.io/legal",
		technician: {
			email: "chasemoskal@gmail.com",
		},
		appDetails: {
			appId: "6Ns7WcB8xCqgSSMtqxZNCYXDK8N8qNM2cFRrwGggrTSD8TDx",
			label: "Xiome Cloud",
			home: platformHome,
			origins: platformOrigins,
		},
	},
	email: "mock-console",
	database: "mock-localstorage",
	stripe: "mock-mode",
	crypto: {
		keys: "mock-mode",
		tokenLifespans: {
			login: 5 * minute,
			refresh: 30 * day,
			access: 5 * minute,
			external: 5 * minute,
		},
	},
})
