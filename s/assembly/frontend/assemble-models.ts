
// import {makeStoreModel} from "../../features/store/model/store-model.js"
import {AssembleModelsOptions} from "./types/assemble-models-options.js"
import {makeQuestionsModel} from "../../features/questions/model/questions-model.js"
import {makeAppsModel} from "../../features/auth2/aspects/apps/models/apps-model.js"
import {makeAccessModel} from "../../features/auth2/aspects/users/models/access-model.js"
import {makePersonalModel} from "../../features/auth2/aspects/users/models/personal-model.js"
import {makeAdministrativeModel} from "../../features/administrative/models/administrative-model.js"
import {makePermissionsModel} from "../../features/auth2/aspects/permissions/models/permissions-model.js"

export async function assembleModels({
		appId,
		remote,
		popups,
		storage,
		authMediator,
	}: AssembleModelsOptions) {

	const authModel = makeAccessModel({
		authMediator,
		loginService: remote.auth.users.loginService,
	})

	const {getValidAccess, reauthorize} = authModel

	const personalModel = makePersonalModel({
		reauthorize,
		getAccess: getValidAccess,
		personalService: remote.auth.users.personalService,
	})

	const appModel = makeAppsModel({
		getAccess: getValidAccess,
		appService: remote.auth.apps.appService,
		appEditService: remote.auth.apps.appEditService,
	})

	const permissionsModel = makePermissionsModel({
		permissionsService: remote.auth.permissions.permissionsService,
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
