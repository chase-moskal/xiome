
import {VideoTables} from "../types/video-tables.js"
import {asApi} from "renraku/x/identities/as-api.js"
import * as Dacast from "../dacast/types/dacast-types.js"
import {GetDacastClient} from "../types/video-concepts.js"
import {makeDacastService} from "./services/dacast-service.js"
import {makeContentService} from "./services/content-service.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"

export function videosApi({
		config,
		videoTables,
		authPolicies,
		getDacastClient,
		verifyDacastApiKey,
	}: {
		config: SecretConfig
		videoTables: UnconstrainedTables<VideoTables>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		getDacastClient: GetDacastClient
		verifyDacastApiKey: Dacast.VerifyApiKey
	}) {

	const options = {
		config,
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
			getDacastClient,
		}),
	})
}
