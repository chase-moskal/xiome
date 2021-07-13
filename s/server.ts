
import json5 from "json5"
import {makeNodeHttpServer} from "renraku/x/server/make-node-http-server.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"
import {serveletLoggerWithColors} from "renraku/x/servelet/logger/servelet-logger-with-colors.js"

import {deathWithDignity} from "./toolbox/death-with-dignity.js"
import {SecretConfig} from "./assembly/backend/types/secret-config.js"
import {configureApiForNode} from "./assembly/backend/configure-api-for-node.js"

void async function main() {
	deathWithDignity()

	console.log("starting server...")
	const config = json5.parse<SecretConfig>(process.env.XIOME_CONFIG)

	const {api} = await configureApiForNode(config)
	const serveletLogger = serveletLoggerWithColors(console, config.server.detailedLogs)
	const servelet = makeJsonHttpServelet(api, serveletLogger)
	const server = makeNodeHttpServer(servelet)

	server.listen(config.server.port)
	console.log(`📡 ${config.platform.appDetails.label} listening on port ${config.server.port}`)
	console.log(` - platform app id: ${config.platform.appDetails.appId}`)
}()
