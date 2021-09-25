
import {VideoTables} from "../types/video-tables.js"
import {asApi} from "renraku/x/identities/as-api.js"
import * as Dacast from "../dacast/types/dacast-types.js"
import {makeDacastService} from "./services/dacast-service.js"
import {makeContentService} from "./services/content-service.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export function videosApi({
		videoTables,
		authPolicies,
		makeDacastClient,
		verifyDacastApiKey,
	}: {
		videoTables: UnconstrainedTables<VideoTables>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		makeDacastClient: Dacast.MakeClient
		verifyDacastApiKey: Dacast.VerifyApiKey
	}) {

	const options = {
		videoTables,
		basePolicy: authPolicies.anonPolicy,
	}

	return asApi({
		dacastService: makeDacastService({
			...options,
			verifyDacastApiKey,
		}),
		contentService: makeContentService({
			...options,
			makeDacastClient,
		}),
	})
}
