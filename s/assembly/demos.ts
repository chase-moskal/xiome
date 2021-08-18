
import {applyMockHacks} from "./frontend/mocks/apply-mock-hacks.js"
import {mockConnectApp} from "./frontend/connect/mock/mock-connect-app.js"
import {addMockLatency} from "./frontend/mocks/effects/add-mock-latency.js"
import {memoryFlexStorage} from "../toolbox/flex-storage/memory-flex-storage.js"
import {registerComponents} from "../framework/component/register-components.js"
import {assembleAndInitializeFrontend} from "./frontend/assemble-and-initialize-frontend.js"

export async function demos() {
	const connection = await mockConnectApp({
		appWindowLink: window.location.href,
		origins: [window.location.origin],
		storage: memoryFlexStorage(),
	})

	connection.remote = addMockLatency({
		remote: connection.remote,
		latency: {min: 200, max: 800},
	})

	const frontend = await assembleAndInitializeFrontend(connection)
	applyMockHacks({connection, frontend})
	const xiome = {...connection, ...frontend}
	document.body.prepend(xiome.modalsElement)

	await xiome.models.accessModel.sendLoginLink("creative@xiome.io")

	const demoComponents = {}
	for (const [key, value] of Object.entries(xiome.components))
		demoComponents[`Demo${key}`] = value

	registerComponents(demoComponents)
}
