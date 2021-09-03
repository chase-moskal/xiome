
// import {makeStoreModel} from "../../features/store/model/store-model.js"
import {AssembleModelsOptions} from "../types/assemble-models-options.js"
import {makeExampleModel} from "../../../features/example/models/example-model.js"
import {makeAppsModel} from "../../../features/auth/aspects/apps/models/apps-model.js"
import {makeQuestionsModel} from "../../../features/questions/model/questions-model.js"
import {makeAccessModel} from "../../../features/auth/aspects/users/models/access-model.js"
import {makePersonalModel} from "../../../features/auth/aspects/users/models/personal-model.js"
import {makeAdministrativeModel} from "../../../features/administrative/models/administrative-model.js"
import {makePermissionsModel} from "../../../features/auth/aspects/permissions/models/permissions-model.js"
import {makeLivestreamModel} from "../../../features/livestream/models/livestream-model.js"

export async function assembleModels({
		appId,
		remote,
		popups,
		storage,
		authMediator,
	}: AssembleModelsOptions) {

	const accessModel = makeAccessModel({
		authMediator,
		loginService: remote.auth.users.loginService,
	})

	const {getValidAccess, reauthorize} = accessModel

	const exampleModel = makeExampleModel({})

	const personalModel = makePersonalModel({
		reauthorize,
		getAccess: getValidAccess,
		personalService: remote.auth.users.personalService,
	})

	const appsModel = makeAppsModel({
		getAccess: getValidAccess,
		appService: remote.auth.apps.appService,
		appEditService: remote.auth.apps.appEditService,
	})

	const permissionsModel = makePermissionsModel({
		permissionsService: remote.auth.permissions.permissionsService,
		reauthorize,
	})

	const livestreamModel = makeLivestreamModel({
		...remote.livestream,
		getAccess: () => accessModel.access,
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
		reauthorize: () => accessModel.reauthorize(),
	})

	const questionsModel = makeQuestionsModel({
		...remote.questions,
		getAccess: () => accessModel.access,
	})

	accessModel.onAccessChange(async access => {
		await Promise.all([
			exampleModel.accessChange(access),
			appsModel.accessChange(),
			permissionsModel.accessChange(access),
			// storeModel.accessChange(access),
			questionsModel.accessChange(access),
			administrativeModel.accessChange(access),
			livestreamModel.accessChange(access),
		])
	})

	return {
		exampleModel,
		appsModel,
		accessModel,
		// storeModel,
		personalModel,
		questionsModel,
		livestreamModel,
		permissionsModel,
		administrativeModel,
	}
}