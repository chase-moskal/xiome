
import {autorun} from "mobx"
import {makeAppModel} from "../features/auth/models/app-model.js"
import {makeAuthModel} from "../features/auth/models/auth-model2.js"
import {makePersonalModel} from "../features/auth/models/personal-model.js"
import {AssembleModelsOptions} from "./types/frontend/system-models-options.js"

export async function assembleModels({
		link,
		remote,
		authGoblin,
	}: AssembleModelsOptions) {

	const authModel = makeAuthModel({
		authGoblin,
		loginService: remote.auth.loginService,
	})

	const {getValidAccess, reauthorize} = authModel

	const personalModel = makePersonalModel({
		getAccess: getValidAccess,
		reauthorize,
		personalService: remote.auth.personalService,
	})

	const appModel = makeAppModel({
		getAccess: getValidAccess,
		appService: remote.auth.appService,
	})

	autorun(() => {
		const access = authModel.accessLoadingView
		console.log("access:", access)
	})

	return {
		appModel,
		authModel,
		personalModel,
	}
}
