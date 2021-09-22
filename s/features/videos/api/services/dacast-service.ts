
import {apiContext} from "renraku/x/api/api-context.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {videoPrivileges} from "../video-privileges.js"
import {VideoTables} from "../../types/video-tables.js"
import * as Dacast from "../../dacast/types/dacast-types.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {VideoAuth, VideoMeta} from "../../types/video-auth.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {DacastLinkDisplay, DacastLinkSecret} from "../../types/dacast-link.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"

function toLinkDisplay(
		secret: undefined | DacastLinkSecret
	): DacastLinkDisplay {
	return secret
		? {time: secret.time}
		: undefined
}

export const makeDacastService = ({
		videoTables: rawVideoTables,
		basePolicy,
		verifyDacastApiKey,
	}: {
		videoTables: UnconstrainedTables<VideoTables>
		basePolicy: Policy<AnonMeta, AnonAuth>
		verifyDacastApiKey: Dacast.VerifyApiKey
	}) => apiContext<VideoMeta, VideoAuth>()({

	policy: async(meta, request) => {
		const auth = await basePolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
		checker.requirePrivilege("moderate videos")
		return {
			...auth,
			checker,
			videoTables: rawVideoTables.namespaceForApp(appId),
		}
	},

	expose: {

		async getLink({videoTables}) {
			const secret = await videoTables.dacastAccountLinks.one({
				conditions: false,
			})
			return toLinkDisplay(secret)
		},

		async setLink({videoTables}, {apiKey}: {apiKey: string}) {
			const good = await verifyDacastApiKey(apiKey)
			const secret = good
				? {apiKey, time: Date.now()}
				: undefined
			await videoTables.dacastAccountLinks.delete({conditions: false})
			if (secret)
				await videoTables.dacastAccountLinks.create(secret)
			return toLinkDisplay(secret)
		},

		async clearLink({videoTables}): Promise<void> {
			await videoTables.dacastAccountLinks.delete({
				conditions: false,
			})
			return undefined
		},
	},
})
