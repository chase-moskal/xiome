
import {autorun} from "mobx"

import {makeAppModel} from "../features/auth/models/app-model.js"
import {makeAuthModel2} from "../features/auth/models/auth-model2.js"
import {makePersonalModel} from "../features/auth/models/personal-model.js"
import {loginWithTokenFromLink} from "./frontend/login-with-token-from-link.js"

import {SystemRemote} from "./types/frontend/system-remote.js"
import {AuthGoblin} from "../features/auth/types/goblin/auth-goblin.js"

export async function assembleFrontend({
		link,
		remote,
		authGoblin,
	}: {
		link: string
		remote: SystemRemote
		authGoblin: AuthGoblin
	}) {

	const authModel = makeAuthModel2({
		authGoblin,
		loginService: remote.auth.loginService,
	})

	const {getAccess, getAccessLoad, reauthorize} = authModel

	const personalModel = makePersonalModel({
		getAccess,
		reauthorize,
		personalService: remote.auth.personalService,
	})

	const appModel = makeAppModel({
		getAccess,
		appService: remote.auth.appService,
	})

	await loginWithTokenFromLink({link, authModel})

	autorun(() => {
		const accessLoad = getAccessLoad()
		personalModel.acceptAccessLoad(accessLoad)
	})

	return {
		appModel,
		authModel,
		personalModel,
	}
}
