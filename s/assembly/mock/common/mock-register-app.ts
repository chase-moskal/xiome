
import {Await} from "../../../types/await.js"
import {mockBackend} from "../../backend/mock-backend.js"

export async function mockRegisterApp({appOrigins, apiLink, backend}: {
		apiLink: string
		appOrigins: string[]
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const mockBrowserForPlatform = await backend.mockBrowser()
	const mockWindowForPlatform = await mockBrowserForPlatform.mockAppWindow({
		apiLink,
		latency: false,
		appId: backend.platformAppId,
		windowLink: window.location.href,
	})

	const {authModel, appModel} = mockWindowForPlatform.models
	const creativeEmail = "creative@xiome.io"
	await authModel.sendLoginLink(creativeEmail)
	await authModel.login(backend.getLatestLoginEmail().loginToken)

	const {appId} = await appModel.registerApp({
		label: "Mock App",
		home: window.location.href,
		origins: []
	})

	return appId
}
