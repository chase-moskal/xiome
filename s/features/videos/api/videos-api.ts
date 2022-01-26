
import * as renraku from "renraku"

import {Dacast} from "../dacast/types/dacast-types.js"
import {makeDacastService} from "./services/dacast-service.js"
import {makeContentService} from "./services/content-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"

export function videosApi({
		config,
		authPolicies,
		dacastSdk,
	}: {
		config: SecretConfig
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		dacastSdk: Dacast.Sdk
	}) {

	const options = {
		config,
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
