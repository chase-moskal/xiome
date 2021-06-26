
import * as json5 from "json5"
import {readFile} from "fs/promises"
import {makeNodeHttpServer} from "renraku/x/server/make-node-http-server.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {configureApiForNode} from "./assembly/backend/configure-api-for-node.js"
import {SecretConfig} from "./assembly/backend/types/secret-config.js"

void async function main() {
	console.log("starting server...")

	const config: SecretConfig = json5.parse(
		await readFile("./config.json", "utf-8")
	)

	const {api} = await configureApiForNode(config)
	const servelet = makeJsonHttpServelet(api)
	const server = makeNodeHttpServer(servelet)

	server.listen(config.server.port)
	console.log(`📡 ${config.platform.appDetails.label} listening on port ${config.server.port}`)
	console.log(` - platform app id: ${config.platform.appDetails.appId}`)
}()
