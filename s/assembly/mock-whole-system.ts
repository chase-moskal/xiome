
import {assembleApi} from "./assemble-api.js"
import {prepareMockBrowser} from "./mocks/mock-browser.js"
import {mockPrerequisites} from "./mocks/mock-prerequisites.js"

import {AppPayload, SendLoginEmail} from "../features/auth/auth-types.js"

// TODO merge testable system
export async function mockWholeSystem({sendLoginEmail, generateNickname}: {
		sendLoginEmail: SendLoginEmail
		generateNickname: () => string
	}) {

	const {
		rando,
		config,
		tables,
		signToken,
		verifyToken,
	} = await mockPrerequisites()

	const api = assembleApi({
		rando,
		config,
		tables,
		signToken,
		verifyToken,
		sendLoginEmail,
		generateNickname,
	})

	const fakeBrowser = prepareMockBrowser({api})

	return {
		api,
		config,
		tables,
		fakeBrowser,
		hacks: {
			async signAppToken(payload: AppPayload) {
				return signToken({payload, lifespan: config.tokens.lifespans.app})
			},
		},
	}
}
