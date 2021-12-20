
import {renrakuService, RenrakuPolicy} from "renraku"

import {VideoMeta} from "../../types/video-auth.js"
import {videoPrivileges} from "../video-privileges.js"
import {VideoTables} from "../../types/video-tables.js"
import {schema} from "../../../../toolbox/darkvalley.js"
import {Dacast} from "../../dacast/types/dacast-types.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {DacastLinkDisplay, DacastLinkRow} from "../../types/dacast-link.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {validateDacastApiKeyAllowingMock} from "../validation/validate-dacast-api-key.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"
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
	videoTables: rawVideoTables,
	basePolicy,
}: {
	config: SecretConfig
	dacastSdk: Dacast.Sdk
	videoTables: UnconstrainedTables<VideoTables>
	basePolicy: RenrakuPolicy<AnonMeta, AnonAuth>
}) => renrakuService()

.policy(async(meta: VideoMeta, request) => {
	const auth = await basePolicy(meta, request)
	const appId = DamnId.fromString(auth.access.appId)
	const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
	checker.requirePrivilege("moderate videos")
	const engine = makePermissionsEngine({
		isPlatform: auth.access.appId === config.platform.appDetails.appId,
		permissionsTables: auth.authTables.permissions,
	})
	return {
		...auth,
		checker,
		engine,
		videoTables: rawVideoTables.namespaceForApp(appId),
	}
})

.expose(({videoTables}) => ({

	async getLink() {
		const secret = await videoTables.dacastAccountLinks.one({
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
			await videoTables.dacastAccountLinks.update({
				conditions: false,
				upsert: secret,
			})
		}
		return toLinkDisplay(secret)
	},

	async clearLink(): Promise<void> {
		await videoTables.dacastAccountLinks.delete({
			conditions: false,
		})
		return undefined
	},
}))
