
import {makeAppModel} from "../../features/auth/models/app-model.js"
import {AssembleModelsOptions} from "./types/system-models-options.js"
import {makeAuthModel} from "../../features/auth/models/auth-model2.js"
import {makePersonalModel} from "../../features/auth/models/personal-model.js"
import {makePermissionsModel} from "../../features/auth/models/permissions-model.js"
import {bankModel as makeBankModel} from "../../features/store/models/bank-manager/bank-model.js"
import {subscriptionPlanningModel as makeSubscriptionPlanningModel} from "../../features/store/models/subscription-planning-model/subscription-planning-model.js"

export async function assembleModels({
		modals,
		remote,
		authGoblin,
		popups,
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

	const subscriptionPlanningModel = makeSubscriptionPlanningModel({
		shopkeepingService: remote.store.shopkeepingService,
	})

	const bankModel = makeBankModel({
		stripeAccountsService: remote.store.stripeConnectService,
		triggerBankPopup: popups.triggerBankPopup,
	})

	authModel.onAccessChange(access => {
		appModel.accessChange()
		permissionsModel.accessChange(access)
		subscriptionPlanningModel.accessChange(access)
	})

	return {
		appModel,
		authModel,
		bankModel,
		personalModel,
		permissionsModel,
		subscriptionPlanningModel,
	}
}
