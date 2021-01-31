
import {LoginEmailDetails} from "../../auth-types.js"
import {getRando} from "../../../../toolbox/get-rando.js"
import {memoryStorage} from "../../../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../../../assembly/mock-whole-system.js"
import {platformLink, technicianEmail, platformAppLabel} from "./constants.js"
import {standardNicknameGenerator} from "../../tools/nicknames/standard-nickname-generator.js"

export async function testableSystem() {
	let latestLoginEmail: LoginEmailDetails

	const rando = await getRando()
	const system = await mockWholeSystem({
		rando,
		platformLink,
		technicianEmail,
		platformAppLabel,
		tableStorage: memoryStorage(),
		generateNickname: standardNicknameGenerator({rando}),
		sendLoginEmail: async (details) => { latestLoginEmail = details },
	})

	return {
		system,
		getLatestLoginEmail: () => latestLoginEmail,
	}
}
