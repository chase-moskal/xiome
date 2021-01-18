
import {autorun} from "mobx"

import {SimpleStorage} from "../toolbox/json-storage.js"
import {AppModel} from "../features/auth/models/app-model.js"
import {makeTokenStore} from "../features/auth/token-store.js"
// import {AuthModel} from "../features/auth/models/auth-model.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
import {makeAuthModel2} from "../features/auth/models/auth-model2.js"
import {PersonalModel} from "../features/auth/models/personal-model.js"
import {decodeAccessToken} from "../features/auth/tools/decode-access-token.js"

import {SystemRemote} from "./types/frontend/system-remote.js"
import {AuthGoblin} from "./types/frontend/auth-goblin/auth-goblin.js"

export async function assembleFrontend({
		url,
		remote,
		authGoblin,
		// triggerAccountPopup,
	}: {
		url: string
		remote: SystemRemote
		authGoblin: AuthGoblin
		// triggerAccountPopup: TriggerAccountPopup
	}) {

	// const {auth} = remote

	// const tokenStore = makeTokenStore({
	// 	storage,
	// 	authorize: auth.loginService.authorize
	// })

	const authModel = makeAuthModel2({
		authGoblin,
		loginService: remote.auth.loginService,
	})

	// const authModel = new AuthModel({
	// 	tokenStore,
	// 	decodeAccessToken,
	// 	triggerAccountPopup,
	// })

	// const personalModel = new PersonalModel({
	// 	getAuthApi,
	// 	reauthorize: authModel.reauthorize,
	// })

	// const appModel = new AppModel({
	// 	getAuthApi,
	// 	authModel,
	// 	decodeAccessToken,
	// })

	// autorun(() => {
	// 	const {authLoad} = authModel
	// 	personalModel.handleAuthLoad(authLoad)
	// })

	return {
		models: {
			authModel,
			// app: appModel,
			// personal: personalModel,
		},
	}
}
