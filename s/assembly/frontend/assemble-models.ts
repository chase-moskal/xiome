
import {makeAppModel} from "../../features/auth/models/app-model.js"
import {AssembleModelsOptions} from "./types/system-models-options.js"
import {makeAuthModel} from "../../features/auth/models/auth-model2.js"
import {makePersonalModel} from "../../features/auth/models/personal-model.js"
import {makePermissionsModel} from "../../features/auth/models/permissions-model.js"

export async function assembleModels({
		modals,
		remote,
		authGoblin,
	}: AssembleModelsOptions) {

	const authModel = makeAuthModel({
		authGoblin,
		loginService: remote.auth.loginService,
	})

	const {getValidAccess, reauthorize} = authModel

	const personalModel = makePersonalModel({
		reauthorize,
		getAccess: getValidAccess,
		personalService: remote.auth.personalService,
	})

	const appModel = makeAppModel({
		getAccess: getValidAccess,
		appService: remote.auth.appService,
		manageAdminsService: remote.auth.manageAdminsService,
	})

	const permissionsModel = makePermissionsModel({
		getAccess: getValidAccess,
		permissionsService: remote.auth.permissionsService,
	})

	authModel.onAccessChange(access => {
		appModel.accessChange()
		permissionsModel.accessChange(access)
	})

	return {
		appModel,
		authModel,
		personalModel,
		permissionsModel,
	}
}
