
import {autorun} from "mobx"
import {addMeta} from "renraku/dist/curries.js"

import {SimpleStorage} from "../toolbox/json-storage.js"
import {makeTokenStore} from "../features/auth/token-store.js"
import {AuthModel} from "../features/auth/models/auth-model.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
import {PersonalModel} from "../features/auth/models/personal-model.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {BackendSystems} from "./assembly-types.js"
import {prepareApiAuthorizer} from "./api-auth/prepare-api-authorizer.js"

export async function assembleFrontend({
			backend,
			storage,
			appToken,
			triggerAccountPopup,
		}: {
			appToken: string
			storage: SimpleStorage
			backend: BackendSystems
			triggerAccountPopup: TriggerAccountPopup
		}) {

	const {authApi} = backend
	const getAuthApi = prepareApiAuthorizer(authApi, appToken)

	const tokenStore = makeTokenStore({
		storage,
		authorize: addMeta(async() => ({appToken}), authApi.loginTopic.authorize),
	})

	const auth = new AuthModel({
		tokenStore,
		getAuthApi,
		decodeAccessToken,
		triggerAccountPopup,
	})

	const personal = new PersonalModel({
		getAuthApi,
		reauthorize: auth.reauthorize,
	})

	autorun(() => {
		const {authLoad} = auth
		personal.handleAuthLoad(authLoad)
	})

	return {
		models: {auth, personal},
	}
}
