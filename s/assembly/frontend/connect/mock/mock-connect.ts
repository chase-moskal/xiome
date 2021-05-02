
import {mockConnectApp} from "./mock-connect-app.js"
import {mockConnectPlatform} from "./mock-connect-platform.js"
import {XiomeConfigMock} from "../../types/xiome-config-mock.js"
import {sendEmail} from "../../../../features/auth/tools/emails/mock-send-email.js"
import {simpleFlexStorage} from "../../../../toolbox/flex-storage/simple-flex-storage.js"

export async function mockConnect(config: XiomeConfigMock) {
	const options = {
		origins: [window.location.origin],
		storage: simpleFlexStorage(window.localStorage),
		platformHome: window.location.href,
		appWindowLink: window.location.href,
		sendEmail,
	}
	return config.mock === "platform"
		? await mockConnectPlatform(options)
		: await mockConnectApp(options)
}
