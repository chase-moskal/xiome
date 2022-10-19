
import {SecretConfig} from "../types/secret-config.js"
import {day, minute} from "../../../toolbox/goodtimes/times.js"

export const mockConfig = ({root, platformHome, platformOrigins}: {
		root: string
		platformHome: string
		platformOrigins: string[]
	}): SecretConfig => ({
	webRoot: root,
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
			appId: "27a9f4e61286d562c85df1862e88c50e6b5c0707cc84e3e1df4aeb9d9c236814",
			label: "Xiome Cloud",
			home: platformHome,
			origins: platformOrigins,
		},
	},
	dacast: "mock-mode",
	email: "mock-console",
	database: "mock-storage",
	stripe: "mock-mode",
	store: {
		popupReturnUrl: "/popups/return"
	},
	chat: {
		port: 8001
	},
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
