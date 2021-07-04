
import {makeAppModel} from "../../features/auth/models/app-model.js"
import {makeAuthModel} from "../../features/auth/models/auth-model2.js"
// import {makeStoreModel} from "../../features/store/model/store-model.js"
import {AssembleModelsOptions} from "./types/assemble-models-options.js"
import {makePersonalModel} from "../../features/auth/models/personal-model.js"
import {makePermissionsModel} from "../../features/auth/models/permissions-model.js"
import {makeQuestionsModel} from "../../features/questions/model/questions-model.js"
import {makeAdministrativeModel} from "../../features/administrative/models/administrative-model.js"

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
		reauthorize,
	})

	// // TODO reactivate store
	// const storeModel = makeStoreModel({
	// 	appId,
	// 	storage,
	// 	shopkeepingService: remote.store.shopkeepingService,
	// 	stripeAccountsService: remote.store.stripeConnectService,
	// 	statusCheckerService: remote.store.ecommerce.statusCheckerService,
	// 	statusTogglerService: remote.store.ecommerce.statusTogglerService,
	// 	triggerBankPopup: popups.triggerBankPopup,
	// })

	const administrativeModel = makeAdministrativeModel({
		roleAssignmentService: remote.administrative.roleAssignmentService,
		reauthorize: () => authModel.reauthorize(),
	})

	const questionsModel = makeQuestionsModel({
		...remote.questions,
		getAccess: () => authModel.access,
	})

	authModel.onAccessChange(async access => {
		await Promise.all([
			appModel.accessChange(),
			permissionsModel.accessChange(access),
			// storeModel.accessChange(access),
			questionsModel.accessChange(access),
			administrativeModel.accessChange(access),
		])
	})

	return {
		appModel,
		authModel,
		// storeModel,
		personalModel,
		questionsModel,
		permissionsModel,
		administrativeModel,
	}
}
