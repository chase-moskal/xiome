
import {LoginEmailDetails} from "../../auth-types.js"
import {getRando} from "../../../../toolbox/get-rando.js"
import {memoryStorage} from "../../../../toolbox/json-storage.js"
import {mockBackend} from "../../../../assembly/backend/mock-backend.js"
import {platformLink, technicianEmail, platformAppLabel} from "./constants.js"
import {standardNicknameGenerator} from "../../tools/nicknames/standard-nickname-generator.js"

export async function testableSystem() {
	let latestLoginEmail: LoginEmailDetails

	const rando = await getRando()
	const system = await mockBackend({
		rando,
		platformHome: platformLink,
		technicianEmail,
		platformLabel: platformAppLabel,
		tableStorage: memoryStorage(),
		generateNickname: standardNicknameGenerator({rando}),
		sendLoginEmail: async (details) => { latestLoginEmail = details },
	})

	return {
		system,
		getLatestLoginEmail: () => latestLoginEmail,
	}
}
