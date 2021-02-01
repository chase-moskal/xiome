
import {assembleApi} from "./assemble-api.js"
import {mockBrowser} from "./frontend/mocks/mock-browser.js"
import {mockPrerequisites} from "./backend/mock-prerequisites.js"

import {AppPayload} from "../features/auth/auth-types.js"
import {MockSystemOptions} from "./types/mock-system-options.js"

export async function mockWholeSystem({
		rando,
		tableStorage,
		platformLink,
		technicianEmail,
		platformAppLabel,
		sendLoginEmail,
		generateNickname,
	}: MockSystemOptions) {

	const {
		config,
		tables,
		signToken,
		verifyToken,
	} = await mockPrerequisites({
		rando,
		tableStorage,
		platformLink,
		technicianEmail,
		platformAppLabel,
	})

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
		payload: {
			platform: true,
			appId: config.platform.appDetails.appId,
			origins: config.platform.appDetails.origins,
		},
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
