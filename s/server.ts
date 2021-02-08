
import {makeNodeHttpServer} from "renraku/x/server/make-node-http-server.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {getRando} from "./toolbox/get-rando.js"
import {memoryStorage} from "./toolbox/json-storage.js"
import {mockBackend} from "./assembly/backend/mock-backend.js"
import {sendEmail} from "./features/auth/tools/emails/mock-send-email.js"
import {prepareSendLoginEmail} from "./features/auth/tools/emails/send-login-email.js"
import {standardNicknameGenerator} from "./features/auth/tools/nicknames/standard-nickname-generator.js"

const port = 4999

void async function main() {
	console.log("starting server in mock mode")

	const rando = await getRando()
	const system = await mockBackend({
		rando,
		platformHome: "http://localhost:5000/",
		technicianEmail: "chasemoskal@gmail.com",
		platformLabel: "Xiome Platform",
		tableStorage: memoryStorage(),
		sendLoginEmail: prepareSendLoginEmail({sendEmail}),
		generateNickname: standardNicknameGenerator({rando}),
	})

	const servelet = makeJsonHttpServelet(system.api)
	const server = makeNodeHttpServer(servelet)

	console.log(`🎟️ platform app id: ${system.platformAppId}`)

	server.listen(port)
	console.log(`📡 server listening on port ${port}`)
}()
