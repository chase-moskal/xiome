
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {greenTopic} from "../../../features/auth/topics/green-topic.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {makeAuthMediator} from "../../../features/auth/mediator/auth-mediator.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"

export function prepareApiShape({appId, storage}: {
		appId: string
		storage: FlexStorage
	}) {

	let authMediator: AuthMediator

	const standardAugment = {
		getMeta: async() => ({
			accessToken: await authMediator.getAccessToken(),
		}),
	}

	const shape = asShape<SystemApi>({
		auth: {
			greenService: {
				[_augment]: {getMeta: async() => undefined},
				authorize: true,
			},
			loginService: {
				[_augment]: standardAugment,
				authenticateViaLoginToken: true,
				sendLoginLink: true,
			},
			appService: {
				[_augment]: standardAugment,
				listApps: true,
				registerApp: true,
			},
			appEditService: {
				[_augment]: standardAugment,
				deleteApp: true,
				updateApp: true,
			},
			manageAdminsService: {
				[_augment]: standardAugment,
				listAdmins: true,
				assignAdmin: true,
				revokeAdmin: true,
				assignPlatformUserAsAdmin: true,
			},
			personalService: {
				[_augment]: standardAugment,
				setProfile: true,
			},
			userService: {
				[_augment]: standardAugment,
				getUser: true,
			},
			permissionsService: {
				[_augment]: standardAugment,
				assignPrivilege: true,
				createRole: true,
				deleteRole: true,
				fetchPermissions: true,
				unassignPrivilege: true,
			},
		},
		administrative: {
			roleAssignmentService: {
				[_augment]: standardAugment,
				fetchPermissions: true,
				searchUsers: true,
				assignRoleToUser: true,
				revokeRoleFromUser: true,
			},
		},
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
		questions: {
			questionsReadingService: {
				[_augment]: standardAugment,
				fetchQuestions: true,
			},
			questionsPostingService: {
				[_augment]: standardAugment,
				postQuestion: true,
				archiveQuestion: true,
				likeQuestion: true,
				reportQuestion: true,
			},
			questionsModerationService: {
				[_augment]: standardAugment,
				archiveBoard: true,
			},
		},
	})

	function installAuthMediator({greenService}: {
			greenService: Service<typeof greenTopic>
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
