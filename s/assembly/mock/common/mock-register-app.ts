
import {Await} from "../../../types/fancy.js"
import {mockBackend} from "../../backend/mock-backend.js"

export async function mockRegisterApp({apiLink, backend}: {
		apiLink: string
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const mockBrowserForPlatform = await backend.mockBrowser()
	const mockWindowForPlatform = await mockBrowserForPlatform.mockAppWindow({
		apiLink,
		latency: false,
		windowLink: window.location.href,
		appToken: backend.platformAppToken,
	})

	const {authModel, appModel} = mockWindowForPlatform.models
	const creativeEmail = "creative@xiome.io"
	await authModel.sendLoginLink(creativeEmail)
	await authModel.login(backend.getLatestLoginEmail().loginToken)

	const {appId} = await appModel.registerApp({
		label: "Mock App",
		home: window.location.href,
	})
	const {appTokenId} = await appModel.registerAppToken({
		appId,
		label: "Mock Token",
		origins: [window.location.origin],
	})

	const appToken = appModel.appListLoadingView.payload
		.find(app => app.appId === appId).tokens
		.find(token => token.appTokenId === appTokenId).appToken

	return appToken
}
