
import {AuthModel} from "../features/auth/models/auth-model.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
import {PersonalModel} from "../features/auth/models/personal-model.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {BackendSystems} from "./assembly-types.js"
import {prepareApiAuthorizer} from "./api-auth/prepare-api-authorizer.js"

export async function assembleFrontend({
			backend,
			appToken,
			expiryGraceTime,
			triggerAccountPopup,
		}: {
			appToken: string
			expiryGraceTime: number
			backend: BackendSystems
			triggerAccountPopup: TriggerAccountPopup
		}) {
	const {tokenStore, authApi} = backend
	const getAuthApi = prepareApiAuthorizer(authApi, appToken)

	const auth = new AuthModel({
		tokenStore,
		expiryGraceTime,
		getAuthApi,
		decodeAccessToken,
		triggerAccountPopup,
	})

	const personal = new PersonalModel({
		getAuthApi,
		reauthorize: auth.reauthorize,
	})

	return {
		models: {auth, personal},
	}
}
