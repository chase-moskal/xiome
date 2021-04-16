
import {makeAppModel} from "../../features/auth/models/app-model.js"
import {makeAuthModel} from "../../features/auth/models/auth-model2.js"
import {AssembleModelsOptions} from "./types/assemble-models-options.js"
import {makePersonalModel} from "../../features/auth/models/personal-model.js"
import {makePermissionsModel} from "../../features/auth/models/permissions-model.js"
import {bankModel as makeBankModel} from "../../features/store/models/bank-manager/bank-model.js"
import {makeEcommerceModel} from "../../features/store/models/ecommerce-model/ecommerce-model.js"
import {subscriptionPlanningModel as makeSubscriptionPlanningModel} from "../../features/store/models/subscription-planning-model/subscription-planning-model.js"

export async function assembleModels({
		appId,
		modals,
		remote,
		popups,
		storage,
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
		appEditService: remote.auth.appEditService,
		manageAdminsService: remote.auth.manageAdminsService,
	})

	const permissionsModel = makePermissionsModel({
		getAccess: getValidAccess,
		permissionsService: remote.auth.permissionsService,
	})

	const ecommerceModel = makeEcommerceModel({
		appId,
		storage,
		statusCheckerService: remote.store.ecommerce.statusCheckerService,
		statusTogglerService: remote.store.ecommerce.statusTogglerService,
	})

	const subscriptionPlanningModel = makeSubscriptionPlanningModel({
		ecommerceModel,
		shopkeepingService: remote.store.shopkeepingService,
	})

	const bankModel = makeBankModel({
		stripeAccountsService: remote.store.stripeConnectService,
		triggerBankPopup: popups.triggerBankPopup,
	})

	authModel.onAccessChange(async access => {
		await appModel.accessChange()
		await permissionsModel.accessChange(access)
		await subscriptionPlanningModel.accessChange(access)
	})

	return {
		appModel,
		authModel,
		bankModel,
		personalModel,
		ecommerceModel,
		permissionsModel,
		subscriptionPlanningModel,
	}
}
