
import {asShape} from "renraku/x/identities/as-shape.js"
import {_meta} from "renraku/x/types/symbols/meta-symbol.js"

import {Service} from "../../../types/service.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {makeAuthMediator} from "../../../features/auth/mediator/auth-mediator.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"
import {makeGreenService} from "../../../features/auth/aspects/users/services/green-service.js"

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
		example: {
			exampleService: {
				[_meta]: standardMeta,
				exampleFunction: true,
			},
		},
		administrative: {
			roleAssignmentService: {
				[_meta]: standardMeta,
				assignRoleToUser: true,
				fetchPermissions: true,
				revokeRoleFromUser: true,
				searchUsers: true,
			},
		},
		questions: {
			questionsModerationService: {
				[_meta]: standardMeta,
				archiveBoard: true,
				fetchReportedQuestions: true,
			},
			questionsPostingService: {
				[_meta]: standardMeta,
				likeQuestion: true,
				postQuestion: true,
				reportQuestion: true,
				archiveQuestion: true,
			},
			questionsReadingService: {
				[_meta]: standardMeta,
				fetchQuestions: true,
			},
			questionsAnsweringService: {
				[_meta]: standardMeta,
				archiveAnswer: true,
				likeAnswer: true,
				postAnswer: true,
				reportAnswer: true,
			},
		},
		livestream: {
			livestreamViewingService: {
				[_meta]: standardMeta,
				getShows: true,
			},
			livestreamModerationService: {
				[_meta]: standardMeta,
				setShow: true,
			},
		},
	})

	function installAuthMediator({greenService}: {
			greenService: Service<typeof makeGreenService>
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
