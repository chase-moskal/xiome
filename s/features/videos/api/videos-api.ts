
import {VideoTables} from "../types/video-tables.js"
import {asApi} from "renraku/x/identities/as-api.js"
import * as Dacast from "../dacast/types/dacast-types.js"
import {makeDacastService} from "./services/dacast-service.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {mockDacastClient} from "../dacast/mocks/mock-dacast-client.js"

import {goodApiKey} from "../testing/video-testing-setup.js"
import {mockVerifyDacastApiKey} from "../dacast/mocks/mock-verify-dacast-api-key.js"

export function videosApi({
		// dacast,
		videoTables,
		authPolicies,
		// verifyDacastApiKey,
	}: {
		// dacast: Dacast.Client
		videoTables: UnconstrainedTables<VideoTables>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		// verifyDacastApiKey: Dacast.VerifyApiKey
	}) {

	const verifyDacastApiKey = mockVerifyDacastApiKey({goodApiKey})

	return asApi({
		dacastService: makeDacastService({
			basePolicy: authPolicies.anonPolicy,
			videoTables,
			verifyDacastApiKey,
		}),
	})
}
