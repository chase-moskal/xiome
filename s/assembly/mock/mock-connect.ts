
import {mockConnectApp} from "./mock-connect-app.js"
import {mockConnectPlatform} from "./mock-connect-platform.js"
import {XiomeConfigMock} from "../frontend/types/xiome-config-mock.js"
import {sendEmail} from "../../features/auth/tools/emails/mock-send-email.js"

export async function mockConnect(config: XiomeConfigMock) {
	const options = {
		platformHome: window.location.href,
		tableStorage: window.localStorage,
		sendEmail,
	}
	return config.mock === "platform"
		? await mockConnectPlatform(options)
		: await mockConnectApp(options)
}
