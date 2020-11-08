
import {getRando} from "../toolbox/get-rando.js"
import {dbbyMemory} from "../toolbox/dbby/dbby-memory.js"

import {Tables} from "./assembly-types.js"
import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"
import {mockPlatformConfig} from "./mock-platform-config.js"

export async function mockWholeSystem() {
	const rando = await getRando()
	const config = mockPlatformConfig({rando})

	const tables: Tables = {
		core: {
			account: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
			accountViaPasskey: dbbyMemory(),
		},
	}

	const backend = await assembleBackend({
		config,
		rando,
		tables,
	})

	const frontend = await assembleFrontend({
		rando,
		backend,
	})

	return {config, backend, frontend, tables}
}
