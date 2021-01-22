
import {autorun} from "mobx"
import {makeAppModel} from "../features/auth/models/app-model.js"
import {FrontendOptions} from "./types/frontend/frontend-options.js"
import {makeAuthModel} from "../features/auth/models/auth-model.js"
import {makePersonalModel} from "../features/auth/models/personal-model.js"
import {loginWithTokenFromLink} from "./frontend/login-with-token-from-link.js"

export async function assembleFrontend({
		link,
		remote,
		authGoblin,
	}: FrontendOptions) {

	const authModel = makeAuthModel({
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
