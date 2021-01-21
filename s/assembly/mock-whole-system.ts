
import {assembleApi} from "./assemble-api.js"
import {prepareMockBrowser} from "./mocks/mock-browser.js"
import {mockPrerequisites} from "./mocks/mock-prerequisites.js"

import {AppPayload, SendLoginEmail} from "../features/auth/auth-types.js"

// TODO merge testable system
export async function mockWholeSystem({sendLoginEmail}: {
		sendLoginEmail: SendLoginEmail
	}) {

	const {
		rando,
		config,
		tables,
		signToken,
		verifyToken,
		generateNickname,
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

	const mockBrowser = prepareMockBrowser({api})

	const platformAppToken = await signToken<AppPayload>({
		payload: config.platform.app,
		lifespan: 365 * (1000 * 60 * 60 * 24),
	})

	return {
		api,
		config,
		tables,
		mockBrowser,
		platformAppToken,
	}
}
