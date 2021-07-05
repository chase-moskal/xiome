
import {mockConnectApp} from "./mock-connect-app.js"
import {mockConnectPlatform} from "./mock-connect-platform.js"
import {XiomeConfigMock} from "../../types/xiome-config-mock.js"
import {simpleFlexStorage} from "../../../../toolbox/flex-storage/simple-flex-storage.js"

export async function mockConnect(config: XiomeConfigMock) {
	const options = {
		origins: [window.location.origin],
		storage: simpleFlexStorage(window.localStorage),
		platformHome: window.location.href,
		appWindowLink: window.location.href,
		latency: {min: 200, max: 800},
	}
	return config.mock === "platform"
		? await mockConnectPlatform(options)
		: await mockConnectApp(options)
}
