
import {autorun} from "mobx"

import {SimpleStorage} from "../toolbox/json-storage.js"
import {AppModel} from "../features/auth/models/app-model.js"
import {makeTokenStore} from "../features/auth/token-store.js"
import {AuthModel} from "../features/auth/models/auth-model.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
import {PersonalModel} from "../features/auth/models/personal-model.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {SystemRemote} from "./assembly-types.js"

export async function assembleFrontend({
		storage,
		appToken,
		systemRemote,
		triggerAccountPopup,
	}: {
		appToken: string
		storage: SimpleStorage
		systemRemote: SystemRemote
		triggerAccountPopup: TriggerAccountPopup
	}) {

	const {auth} = systemRemote

	const tokenStore = makeTokenStore({
		storage,
		authorize: auth.loginService.authorize
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
		const {authLoad} = authModel
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
