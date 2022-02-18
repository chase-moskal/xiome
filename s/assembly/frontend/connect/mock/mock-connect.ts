
import {simpleFlexStorage} from "dbmage"

import {mockConnectApp} from "./mock-connect-app.js"
import {mockConnectPlatform} from "./mock-connect-platform.js"
import {XiomeMockConfig} from "../../types/xiome-config-mock.js"

export async function mockConnect(config: XiomeMockConfig) {
	const options = {
		origins: [window.location.origin],
		appOrigin: window.location.origin,
		storage: simpleFlexStorage(window.localStorage),
		platformHome: window.location.href,
		appWindowLink: window.location.href,
	}
	return config.mode === "platform"
		? await mockConnectPlatform(options)
		: await mockConnectApp(options)
}
