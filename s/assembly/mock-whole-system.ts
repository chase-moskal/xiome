
import {assembleApi} from "./assemble-api.js"
import {mockBrowser} from "./frontend/mocks/mock-browser.js"
import {mockPrerequisites} from "./backend/mock-prerequisites.js"

import {AppPayload} from "../features/auth/auth-types.js"
import {MockSystemOptions} from "./types/mock-system-options.js"

export async function mockWholeSystem({sendLoginEmail}: MockSystemOptions) {
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

	const platformAppToken = await signToken<AppPayload>({
		payload: config.platform.app,
		lifespan: 365 * (1000 * 60 * 60 * 24),
	})

	return {
		api,
		config,
		tables,
		platformAppToken,
		mockBrowser: async() => mockBrowser({api}),
	}
}
