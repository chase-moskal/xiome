
import {Await} from "../types/await.js"
import {mockConnect} from "./frontend/connect/mock/mock-connect.js"
import {applyMockHacks} from "./frontend/mocks/apply-mock-hacks.js"
import {XiomeMockConfig} from "./frontend/types/xiome-config-mock.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

export async function assembleXiomeMock(mockConfig: XiomeMockConfig) {
	const connection = await mockConnect(mockConfig)
	debugger
	connection.setMockLatency({min: 200, max: 800})
	const frontend = await assembleAndInitializeFrontend(connection)
	debugger
	applyMockHacks({
		frontend,
		connection: <Await<ReturnType<typeof mockConnect>>>connection,
	})
	debugger
	return {...connection, ...frontend}
}
