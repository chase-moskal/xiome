
import {asApi} from "renraku/x/identities/as-api.js"
import {SignToken, VerifyToken} from "redcrypto/x/types.js"

import {DatabaseFinal} from "../types/database.js"
import {authApi} from "../../../features/auth/auth-api.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {exampleApi} from "../../../features/example/api/example-api.js"
import {goodApiKey} from "../../../features/videos/dacast/mocks/constants.js"
import {questionsApi} from "../../../features/questions/api/questions-api.js"
import {livestreamApi} from "../../../features/livestream/api/livestream-api.js"
import {GetDacastClient} from "../../../features/videos/types/video-concepts.js"
import {prepareAuthPolicies} from "../../../features/auth/policies/prepare-auth-policies.js"
import {makeAdministrativeApi} from "../../../features/administrative/api/administrative-api.js"
import {SendLoginEmail} from "../../../features/auth/aspects/users/types/emails/send-login-email.js"
import {standardNicknameGenerator} from "../../../features/auth/utils/nicknames/standard-nickname-generator.js"
import {videosApi} from "../../../features/videos/api/videos-api.js"
import {mockVerifyDacastApiKey} from "../../../features/videos/dacast/mocks/mock-verify-dacast-api-key.js"

export async function assimilateApi({
		config, rando, database,
		sendLoginEmail, signToken, verifyToken, getDacastClient,
	}: {
		database: DatabaseFinal
		sendLoginEmail: SendLoginEmail
		signToken: SignToken
		verifyToken: VerifyToken
		getDacastClient: GetDacastClient
	} & AssimilatorOptions) {

	const generateNickname = standardNicknameGenerator({rando})

	const authPolicies = prepareAuthPolicies({
		config,
		verifyToken,
		appTables: database.apps,
		authTables: database.auth,
	})

	const verifyDacastApiKey = mockVerifyDacastApiKey({goodApiKey})

	return asApi({
		auth: authApi({
			rando,
			config,
			authPolicies,
			signToken,
			verifyToken,
			sendLoginEmail,
			generateNickname,
		}),
		administrative: makeAdministrativeApi({
			config,
			authPolicies,
		}),
		questions: questionsApi({
			rando,
			config,
			authPolicies,
			questionsTables: database.questions,
		}),
		example: exampleApi({
			rando,
			config,
			authPolicies,
			exampleTables: database.example,
		}),
		livestream: livestreamApi({
			authPolicies,
			livestreamTables: database.livestream,
		}),
		videos: videosApi({
			authPolicies,
			videoTables: database.videos,
			getDacastClient,
			verifyDacastApiKey,
		}),
	})
}
