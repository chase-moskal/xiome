
import {CoreModel} from "../features/core/core-model.js"
import {TriggerAccountPopup} from "../features/core/core-types.js"
import {decodeAccessToken} from "../features/core/decode-access-token.js"

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
			core: new CoreModel({
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
