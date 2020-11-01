
import {getRando} from "../toolbox/get-rando.js"
import {mockPlatformConfig} from "./mock-platform-config.js"

import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"

export async function wholeSystemTestable() {
	const rando = await getRando()
	const config = mockPlatformConfig({rando})
	const backend = await assembleBackend({config, rando})
	const frontend = await assembleFrontend({backend, rando})
	return {config, backend, frontend}
}
