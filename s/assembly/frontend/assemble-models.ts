
import {makeAppModel} from "../../features/auth/models/app-model.js"
import {makeAuthModel} from "../../features/auth/models/auth-model2.js"
import {makeStoreModel} from "../../features/store/model/store-model.js"
import {AssembleModelsOptions} from "./types/assemble-models-options.js"
import {makePersonalModel} from "../../features/auth/models/personal-model.js"
import {makePermissionsModel} from "../../features/auth/models/permissions-model.js"

export async function assembleModels({
		appId,
		remote,
		popups,
		storage,
		authMediator,
	}: AssembleModelsOptions) {

	const authModel = makeAuthModel({
		authMediator,
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
		appEditService: remote.auth.appEditService,
		manageAdminsService: remote.auth.manageAdminsService,
	})

	const permissionsModel = makePermissionsModel({
		permissionsService: remote.auth.permissionsService,
	})

	const storeModel = makeStoreModel({
		appId,
		storage,
		shopkeepingService: remote.store.shopkeepingService,
		stripeAccountsService: remote.store.stripeConnectService,
		statusCheckerService: remote.store.ecommerce.statusCheckerService,
		statusTogglerService: remote.store.ecommerce.statusTogglerService,
		triggerBankPopup: popups.triggerBankPopup,
	})

	authModel.onAccessChange(async access => {
		await appModel.accessChange()
		await permissionsModel.accessChange(access)
		await storeModel.accessChange(access)
	})

	return {
		appModel,
		authModel,
		storeModel,
		personalModel,
		permissionsModel,
	}
}
