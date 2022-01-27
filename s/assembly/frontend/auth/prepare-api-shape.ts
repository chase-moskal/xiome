
import * as renraku from "renraku"

import {SystemApi} from "../../backend/types/system-api.js"
import {FlexStorage} from "dbmage"
import {makeAuthMediator} from "../../../features/auth/mediator/auth-mediator.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"
import {makeGreenService} from "../../../features/auth/aspects/users/services/green-service.js"

export function prepareApiShape({appId, storage}: {
		appId: string
		storage: FlexStorage
	}) {

	let authMediator: AuthMediator

	async function getStandardMeta() {
		return {
			accessToken: await authMediator.getValidAccessToken(),
		}
	}

	const metaMap: renraku.MetaMap<SystemApi> = {
		auth: {
			apps: {
				appService: getStandardMeta,
				appEditService: getStandardMeta,
			},
			permissions: {
				permissionsService: getStandardMeta,
			},
			users: {
				greenService: async() => undefined,
				loginService: getStandardMeta,
				personalService: getStandardMeta,
				userService: getStandardMeta,
			},
		},
		example: {
			exampleService: getStandardMeta,
		},
		administrative: {
			roleAssignmentService: getStandardMeta,
		},
		questions: {
			questionsModerationService: getStandardMeta,
			questionsPostingService: getStandardMeta,
			questionsReadingService: getStandardMeta,
			questionsAnsweringService: getStandardMeta,
		},
		videos: {
			dacastService: getStandardMeta,
			contentService: getStandardMeta,
		},
		notes: {
			notesService: getStandardMeta,
		},
	}

	function installAuthMediator({greenService}: {
			greenService: renraku.Remote<ReturnType<typeof makeGreenService>>
		}) {
		authMediator = makeAuthMediator({
			appId,
			storage,
			greenService,
		})
		return authMediator
	}

	return {
		metaMap,
		installAuthMediator,
	}
}
