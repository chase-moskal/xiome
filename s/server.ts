
import json5 from "json5"
import {megabytes} from "renraku"
import {renrakuNodeServer} from "renraku/x/http/node-server.js"

import {deathWithDignity} from "./toolbox/death-with-dignity.js"
import {backendForNode} from "./assembly/backend/backend-for-node.js"
import {SecretConfig} from "./assembly/backend/types/secret-config.js"

void async function main() {
	deathWithDignity()

	console.log("starting server...")
	const config = json5.parse<SecretConfig>(process.env.XIOME_CONFIG)

	const {api} = await backendForNode(config)

	const server = renrakuNodeServer({
		api,
		exposeErrors: false,
		maxPayloadSize: megabytes(10),
	})

	server.listen(config.server.port)
	console.log(`📡 ${config.platform.appDetails.label} listening on port ${config.server.port}`)
	console.log(` - platform app id: ${config.platform.appDetails.appId}`)
}()
