
import {asShape} from "renraku/x/identities/as-shape.js"
import {_augment} from "renraku/x/types/symbols/augment-symbol.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {makeAuthGoblin} from "../../../features/auth/goblin/auth-goblin.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {appTokenTopic} from "../../../features/auth/topics/app-token-topic.js"
import {TokenStore2} from "../../../features/auth/goblin/types/token-store2.js"

export function prepareApiShapeWiredWithAuthGoblin({appId, tokenStore}: {
		appId: string
		tokenStore: TokenStore2
	}) {

	let authGoblin: AuthGoblin

	const augmentForAnon = {
		getMeta: async() => ({
			appToken: await authGoblin.getAppToken(),
		}),
	}

	const augmentForUser = {
		getMeta: async() => ({
			appToken: await authGoblin.getAppToken(),
			accessToken: await authGoblin.getAccessToken(),
		})
	}

	const shape = asShape<SystemApi>({
		auth: {
			appTokenService: {
				[_augment]: {
					getMeta: async() => undefined,
				},
				authorizeApp: true,
			},
			loginService: {
				[_augment]: augmentForAnon,
				authenticateViaLoginToken: true,
				authorize: true,
				sendLoginLink: true,
			},
			appService: {
				[_augment]: augmentForUser,
				listApps: true,
				registerApp: true,
			},
			appEditService: {
				[_augment]: augmentForUser,
				deleteApp: true,
				updateApp: true,
			},
			manageAdminsService: {
				[_augment]: augmentForUser,
				listAdmins: true,
				assignAdmin: true,
				revokeAdmin: true,
				assignPlatformUserAsAdmin: true,
			},
			personalService: {
				[_augment]: augmentForUser,
				setProfile: true,
			},
			userService: {
				[_augment]: augmentForUser,
				getUser: true,
			},
			permissionsService: {
				[_augment]: augmentForUser,
				assignPrivilege: true,
				createPrivilege: true,
				createRole: true,
				deletePrivilege: true,
				deleteRole: true,
				fetchPermissions: true,
				grantRole: true,
				revokeRole: true,
				unassignPrivilege: true,
			},
		},
		store: {
			stripeConnectService: {
				[_augment]: augmentForUser,
				getConnectDetails: true,
				generateConnectSetupLink: true,
			},
			shoppingService: {
				[_augment]: augmentForUser,
				buySubscription: true,
				updateSubscription: true,
				endSubscription: true,
			},
			shopkeepingService: {
				[_augment]: augmentForUser,
				listSubscriptionPlans: true,
				createSubscriptionPlan: true,
				updateSubscriptionPlan: true,
				deleteSubscriptionPlan: true,
				deactivateSubscriptionPlan: true,
			},
			ecommerce: {
				statusCheckerService: {
					[_augment]: augmentForAnon,
					getStoreStatus: true,
				},
				statusTogglerService: {
					[_augment]: augmentForUser,
					disableEcommerce: true,
					enableEcommerce: true,
				},
			},
		},
		questions: {
			questionReadingService: {
				[_augment]: augmentForAnon,
				fetchQuestions: true,
			},
			questionPostingService: {
				[_augment]: augmentForUser,
				postQuestion: true,
			},
			questionModerationService: {
				[_augment]: augmentForUser,
			},
		},
	})

	function installAuthGoblin({loginService, appTokenService}: {
			loginService: Service<typeof loginTopic>
			appTokenService: Service<typeof appTokenTopic>
		}) {
		authGoblin = makeAuthGoblin({
			appId,
			tokenStore,
			authorize: loginService.authorize,
			authorizeApp: appTokenService.authorizeApp,
		})
		return authGoblin
	}

	return {shape, installAuthGoblin}
}
