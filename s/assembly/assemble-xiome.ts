
import {connect} from "./frontend/connect.js"
import {mockBackendAndRemote} from "./mock/mock-backend-and-remote.js"
import {sendEmail} from "../features/auth/tools/emails/mock-send-email.js"
import {apiOrigin, platformHome, platformLabel, technicianEmail} from "./constants.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

import {XiomeConfig} from "./frontend/types/xiome-config.js"
import {XiomeConfigMock} from "./frontend/types/xiome-config-mock.js"
import {XiomeConfigConnected} from "./frontend/types/xiome-config-connected.js"

export async function assembleXiome(config: XiomeConfig) {
	const connection = (<XiomeConfigMock>config).mock
		? await mockBackendAndRemote({
			apiOrigin,
			platformHome,
			platformLabel,
			technicianEmail,
			sendEmail,
		})
		: await connect(<XiomeConfigConnected>config)
	const frontend = await assembleAndInitializeFrontend(connection)
	return {...connection, ...frontend}
}
