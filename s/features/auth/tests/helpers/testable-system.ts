
// import {LoginEmailDetails} from "../../types/emails/login-email-details.js"
// import {getRando} from "../../../../toolbox/get-rando.js"
// import {mockBackend} from "../../../../assembly/backend/mock-backend.js"
// import {platformLink, technicianEmail, platformAppLabel} from "./constants.js"
// import {memoryFlexStorage} from "../../../../toolbox/flex-storage/memory-flex-storage.js"
// import {standardNicknameGenerator} from "../../tools/nicknames/standard-nickname-generator.js"

// export async function testableSystem() {
// 	let latestLoginEmail: LoginEmailDetails

// 	const rando = await getRando()
// 	const system = await mockBackend({
// 		rando,
// 		platformHome: platformLink,
// 		technicianEmail,
// 		platformLabel: platformAppLabel,
// 		tableStorage: memoryFlexStorage(),
// 		generateNickname: standardNicknameGenerator({rando}),
// 		sendLoginEmail: async (details) => { latestLoginEmail = details },
// 	})

// 	return {
// 		system,
// 		getLatestLoginEmail: () => latestLoginEmail,
// 	}
// }
