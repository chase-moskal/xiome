
import {VideoTables} from "../types/video-tables.js"
import {asApi} from "renraku/x/identities/as-api.js"
import {Dacast} from "../dacast/types/dacast-types.js"
import {makeDacastService} from "./services/dacast-service.js"
import {makeContentService} from "./services/content-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export function videosApi({
		config,
		videoTables,
		authPolicies,
		dacastSdk,
	}: {
		config: SecretConfig
		videoTables: UnconstrainedTables<VideoTables>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		dacastSdk: Dacast.Sdk
	}) {

	const options = {
		config,
		videoTables,
		basePolicy: authPolicies.anonPolicy,
	}

	return asApi({
		dacastService: makeDacastService({
			...options,
			dacastSdk,
		}),
		contentService: makeContentService({
			...options,
			dacastSdk,
		}),
	})
}
