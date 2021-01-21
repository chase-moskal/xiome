
import {autorun} from "mobx"

import {makeAppModel} from "../features/auth/models/app-model.js"
import {makeAuthModel2} from "../features/auth/models/auth-model2.js"
import {makePersonalModel} from "../features/auth/models/personal-model.js"

import {SystemRemote} from "./types/frontend/system-remote.js"
import {TriggerAccountPopup} from "../features/auth/auth-types.js"
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

	{
		const {searchParams} = new URL(url)
		const loginToken = searchParams.get("login")
		if (loginToken) await authModel.login(loginToken)
	}

	autorun(() => {
		const accessLoad = getAccessLoad()
		personalModel.acceptAccessLoad(accessLoad)
	})

	return {
		models: {
			appModel,
			authModel,
			personalModel,
		},
	}
}
