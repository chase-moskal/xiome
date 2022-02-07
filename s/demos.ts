
import {memoryFlexStorage} from "dbmage"

import {demoQuestions} from "./assembly/frontend/demos/demo-questions.js"
import {applyMockHacks} from "./assembly/frontend/mocks/apply-mock-hacks.js"
import {registerComponents} from "./framework/component/register-components.js"
import {mockConnectApp} from "./assembly/frontend/connect/mock/mock-connect-app.js"
import {assembleAndInitializeFrontend} from "./assembly/frontend/assemble-and-initialize-frontend.js"

void async function demos() {

	const appWindowLink = window.location.href
	const appOrigin = window.location.origin

	const connection = await mockConnectApp({
		appWindowLink,
		appOrigin,
		origins: [appOrigin],
		storage: memoryFlexStorage(),
	})

	await demoQuestions({appOrigin, connection})

	connection.setMockLatency({min: 200, max: 800})

	const frontend = await assembleAndInitializeFrontend(connection)
	applyMockHacks({connection, frontend})
	const xiome = {...connection, ...frontend}
	document.body.prepend(xiome.modalsElement)

	await xiome.models.accessModel.sendLoginLink("creative@xiome.io")

	const demoComponents = {}
	for (const [key, value] of Object.entries(xiome.components))
		demoComponents[`Demo${key}`] = value

	registerComponents(demoComponents)
}()
