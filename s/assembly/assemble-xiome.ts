
import {connect} from "./frontend/connect.js"
import {mockConnect} from "./mock/mock-connect.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

import {XiomeConfig} from "./frontend/types/xiome-config.js"
import {XiomeConfigMock} from "./frontend/types/xiome-config-mock.js"
import {XiomeConfigConnected} from "./frontend/types/xiome-config-connected.js"

export async function assembleXiome(config: XiomeConfig) {
	const connection = (<XiomeConfigMock>config).mock
		? await mockConnect(<XiomeConfigMock>config)
		: await connect(<XiomeConfigConnected>config)
	const frontend = await assembleAndInitializeFrontend(connection)
	return {...connection, ...frontend}
}
