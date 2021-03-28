
import {Await} from "../types/await.js"
import {connect} from "./frontend/connect/connect.js"
import {mockConnect} from "./frontend/connect/mock/mock-connect.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

import {XiomeConfig} from "./frontend/types/xiome-config.js"
import {applyMockHacks} from "./frontend/mocks/apply-mock-hacks.js"
import {XiomeConfigMock} from "./frontend/types/xiome-config-mock.js"
import {XiomeConfigConnected} from "./frontend/types/xiome-config-connected.js"

export async function assembleXiome(config: XiomeConfig) {
	const isMock = (<XiomeConfigMock>config).mock

	const connection = isMock
		? await mockConnect(<XiomeConfigMock>config)
		: await connect(<XiomeConfigConnected>config)

	const frontend = await assembleAndInitializeFrontend(connection)

	if (isMock)
		applyMockHacks({
			connection: <Await<ReturnType<typeof mockConnect>>>connection,
			frontend,
		})

	return {...connection, ...frontend}
}
