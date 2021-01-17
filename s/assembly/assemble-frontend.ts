
import {autorun} from "mobx"
import {toBusiness} from "renraku/x/transforms/to-business.js"

import {SimpleStorage} from "../toolbox/json-storage.js"
import {AppModel} from "../features/auth/models/app-model.js"
import {makeTokenStore} from "../features/auth/token-store.js"
import {AuthModel} from "../features/auth/models/auth-model.js"
import {PersonalModel} from "../features/auth/models/personal-model.js"
import {AnonAuth, TriggerAccountPopup} from "../features/auth/auth-types.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {BackendSystems, Remotes} from "./assembly-types.js"
import {prepareApiAuthorizer} from "./api-auth/prepare-api-authorizer.js"

export async function assembleFrontend({
			remotes,
			storage,
			appToken,
			triggerAccountPopup,
		}: {
			appToken: string
			remotes: Remotes
			storage: SimpleStorage
			triggerAccountPopup: TriggerAccountPopup
		}) {

	const {auth} = remotes

	const tokenStore = makeTokenStore({
		storage,
		authorize: auth.login.authorize,
	})

	const authModel = new AuthModel({
		tokenStore,
		decodeAccessToken,
		triggerAccountPopup,
	})

	const personalModel = new PersonalModel({
		getAuthApi,
		reauthorize: authModel.reauthorize,
	})

	const appModel = new AppModel({
		getAuthApi,
		authModel,
		decodeAccessToken,
	})

	autorun(() => {
		const {authLoad} = auth
		personalModel.handleAuthLoad(authLoad)
	})

	return {
		models: {
			app: appModel,
			authModel,
			personal: personalModel,
		},
	}
}
