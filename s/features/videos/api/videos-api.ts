
import * as renraku from "renraku"

import {VideoSchema} from "../types/video-schema.js"
import {Dacast} from "../dacast/types/dacast-types.js"
import {makeDacastService} from "./services/dacast-service.js"
import {makeContentService} from "./services/content-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/unconstrained-table.js"

export function videosApi({
		config,
		videoTables,
		authPolicies,
		dacastSdk,
	}: {
		config: SecretConfig
		videoTables: UnconstrainedTables<VideoSchema>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		dacastSdk: Dacast.Sdk
	}) {

	const options = {
		config,
		videoTables,
		basePolicy: authPolicies.anonPolicy,
	}

	return renraku.api({
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
