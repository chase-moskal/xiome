
import {asShape} from "renraku/x/identities/as-shape.js"
import {_meta} from "renraku/x/types/symbols/meta-symbol.js"

import {Service2} from "../../../types/service2.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {makeAuthMediator} from "../../../features/auth2/mediator/auth-mediator.js"
import {AuthMediator} from "../../../features/auth2/mediator/types/auth-mediator.js"
import {makeGreenService} from "../../../features/auth2/aspects/users/services/green-service.js"

export function prepareApiShape({appId, storage}: {
		appId: string
		storage: FlexStorage
	}) {

	let authMediator: AuthMediator

	const standardMeta = async() => ({
		accessToken: await authMediator.getAccessToken(),
	})

	const shape = asShape<SystemApi>({
		auth: {
			apps: {
				appService: {
					[_meta]: standardMeta,
					listApps: true,
					registerApp: true,
				},
				appEditService: {
					[_meta]: standardMeta,
					deleteApp: true,
					updateApp: true,
					listAdmins: true,
					revokeAdmin: true,
					assignAdmin: true,
					assignPlatformUserAsAdmin: true,
				},
			},
			permissions: {
				permissionsService: {
					[_meta]: standardMeta,
					assignPrivilege: true,
					createRole: true,
					deleteRole: true,
					fetchPermissions: true,
					unassignPrivilege: true,
				},
			},
			users: {
				greenService: {
					[_meta]: async() => undefined,
					authorize: true,
				},
				loginService: {
					[_meta]: standardMeta,
					authenticateViaLoginToken: true,
					sendLoginLink: true,
				},
				personalService: {
					[_meta]: standardMeta,
					setProfile: true,
				},
				userService: {
					[_meta]: standardMeta,
					getUser: true,
				},
			},
		},

		// auth: {
		// 	greenService: {
		// 		[_meta]: async() => undefined,
		// 		authorize: true,
		// 	},
		// 	loginService: {
		// 		[_meta]: standardMeta,
		// 		authenticateViaLoginToken: true,
		// 		sendLoginLink: true,
		// 	},
		// 	appService: {
		// 		[_meta]: standardMeta,
		// 		listApps: true,
		// 		registerApp: true,
		// 	},
		// 	appEditService: {
		// 		[_meta]: standardMeta,
		// 		deleteApp: true,
		// 		updateApp: true,
		// 	},
		// 	manageAdminsService: {
		// 		[_meta]: standardMeta,
		// 		listAdmins: true,
		// 		assignAdmin: true,
		// 		revokeAdmin: true,
		// 		assignPlatformUserAsAdmin: true,
		// 	},
		// 	personalService: {
		// 		[_meta]: standardMeta,
		// 		setProfile: true,
		// 	},
		// 	userService: {
		// 		[_meta]: standardMeta,
		// 		getUser: true,
		// 	},
		// 	permissionsService: {
		// 		[_meta]: standardMeta,
		// 		assignPrivilege: true,
		// 		createRole: true,
		// 		deleteRole: true,
		// 		fetchPermissions: true,
		// 		unassignPrivilege: true,
		// 	},
		// },
		// administrative: {
		// 	roleAssignmentService: {
		// 		[_meta]: standardMeta,
		// 		fetchPermissions: true,
		// 		searchUsers: true,
		// 		assignRoleToUser: true,
		// 		revokeRoleFromUser: true,
		// 	},
		// },

		// // TODO reactivate store
		// store: {
		// 	stripeConnectService: {
		// 		[_augment]: standardAugment,
		// 		getConnectDetails: true,
		// 		generateConnectSetupLink: true,
		// 	},
		// 	shoppingService: {
		// 		[_augment]: standardAugment,
		// 		buySubscription: true,
		// 		updateSubscription: true,
		// 		endSubscription: true,
		// 	},
		// 	shopkeepingService: {
		// 		[_augment]: standardAugment,
		// 		listSubscriptionPlans: true,
		// 		createSubscriptionPlan: true,
		// 		updateSubscriptionPlan: true,
		// 		deleteSubscriptionPlan: true,
		// 		deactivateSubscriptionPlan: true,
		// 	},
		// 	ecommerce: {
		// 		statusCheckerService: {
		// 			[_augment]: standardAugment,
		// 			getStoreStatus: true,
		// 		},
		// 		statusTogglerService: {
		// 			[_augment]: standardAugment,
		// 			disableEcommerce: true,
		// 			enableEcommerce: true,
		// 		},
		// 	},
		// },

		// questions: {
		// 	questionsReadingService: {
		// 		[_meta]: standardMeta,
		// 		fetchQuestions: true,
		// 	},
		// 	questionsPostingService: {
		// 		[_meta]: standardMeta,
		// 		postQuestion: true,
		// 		archiveQuestion: true,
		// 		likeQuestion: true,
		// 		reportQuestion: true,
		// 	},
		// 	questionsModerationService: {
		// 		[_meta]: standardMeta,
		// 		archiveBoard: true,
		// 	},
		// },
	})

	function installAuthMediator({greenService}: {
			greenService: Service2<typeof makeGreenService>
		}) {
		authMediator = makeAuthMediator({
			appId,
			storage,
			greenService,
		})
		return authMediator
	}

	return {shape, installAuthMediator}
}
