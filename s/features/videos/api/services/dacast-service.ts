
import * as renraku from "renraku"
import {Id} from "dbmage"

import {VideoMeta} from "../../types/video-auth.js"
import {videoPrivileges} from "../video-privileges.js"
import {schema} from "../../../../toolbox/darkvalley.js"
import {Dacast} from "../../dacast/types/dacast-types.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {DacastLinkDisplay, DacastLinkRow} from "../../types/dacast-link.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {validateDacastApiKeyAllowingMock} from "../validation/validate-dacast-api-key.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"

function toLinkDisplay(
		secret: undefined | DacastLinkRow
	): DacastLinkDisplay {
	return secret
		? {time: secret.time}
		: undefined
}

export const makeDacastService = ({
	config,
	dacastSdk,
	basePolicy,
}: {
	config: SecretConfig
	dacastSdk: Dacast.Sdk
	basePolicy: renraku.Policy<AnonMeta, AnonAuth>
}) => renraku.service()

.policy(async(meta: VideoMeta, request) => {
	const auth = await basePolicy(meta, request)
	const appId = Id.fromString(auth.access.appId)
	const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
	checker.requirePrivilege("moderate videos")
	const engine = makePermissionsEngine({
		isPlatform: auth.access.appId === config.platform.appDetails.appId,
		permissionsTables: auth.database.tables.auth.permissions,
	})
	return {
		...auth,
		checker,
		engine,
	}
})

.expose(({database}) => ({

	async getLink() {
		const secret = await database.tables.videos.dacastAccountLinks.readOne({
			conditions: false,
		})
		return toLinkDisplay(secret)
	},

	async setLink(inputs: {apiKey: string}) {
		const {apiKey} = runValidation(
			inputs,
			schema({
				apiKey: validateDacastApiKeyAllowingMock,
			}),
		)
		const good = await dacastSdk.verifyApiKey(apiKey)
		let secret: DacastLinkRow
		if (good) {
			secret = {apiKey, time: Date.now()}
			await database.tables.videos.dacastAccountLinks.update({
				conditions: false,
				upsert: secret,
			})
		}
		return toLinkDisplay(secret)
	},

	async clearLink(): Promise<void> {
		await database.tables.videos.dacastAccountLinks.delete({
			conditions: false,
		})
		return undefined
	},
}))
