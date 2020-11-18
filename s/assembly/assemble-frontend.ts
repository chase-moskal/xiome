
import {AuthModel} from "../features/auth/auth-model.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {BackendSystems} from "./assembly-types.js"

export async function assembleFrontend({
			backend,
			expiryGraceTime,
			triggerAccountPopup,
		}: {
			expiryGraceTime: number
			backend: BackendSystems
			triggerAccountPopup: TriggerAccountPopup
		}) {
	const {tokenStore} = backend
	return {
		models: {
			auth: new AuthModel({
				tokenStore,
				expiryGraceTime,
				decodeAccessToken,
				triggerAccountPopup,
			}),
			// pay: {},
			// videos: {},
			// questions: {},
		},
	}
}
