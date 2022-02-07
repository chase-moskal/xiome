
// import {mockConfig} from "../backend/config/mock-config.js"
// import {backendForBrowser} from "../backend/backend-for-browser.js"
// import {memoryFlexStorage} from "dbmage"

// export async function assembleTestableSystem() {
// 	const backend = await backendForBrowser(memoryFlexStorage())(mockConfig({
// 		platformHome: "https://xiome.io/",
// 		platformOrigins: ["https://xiome.io"],
// 	}))
// 	const browser = await backend.mockBrowser()

// 	const windowForPlatform = await browser.mockAppWindow({
// 		appId: backend.platformAppId,
// 	})

// 	async function login({email, appWindow}: {
// 			email: string
// 			appWindow: typeof windowForPlatform
// 		}) {
// 		await appWindow.models.accessModel.sendLoginLink(email)
// 		const {loginToken} = backend.emails.recallLatestLoginEmail()
// 		await windowForPlatform.models.accessModel.login(loginToken)
// 	}

// 	await login({
// 		appWindow: windowForPlatform,
// 		email: "creative@example.com",
// 	})

// 	const {appId} = await windowForPlatform.models.appsModel.registerApp({
// 		home: "https://example.com/",
// 		label: "Example Community",
// 		origins: ["https://example.com"],
// 	})

// 	const windowForApp = await browser.mockAppWindow({appId})

// 	return {
// 		backend,
// 		browser,
// 		windowForPlatform,
// 		windowForApp,
// 		login,
// 	}
// }
