
import {connect} from "./frontend/connect/connect.js"
import {XiomeConfig} from "./frontend/types/xiome-config-connected.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

export async function assembleXiome(config: XiomeConfig) {
	const connection = await connect(<XiomeConfig>config)
	const frontend = await assembleAndInitializeFrontend(connection)
	return {...connection, ...frontend}
}
