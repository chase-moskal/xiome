
import * as renraku from "renraku"
import {SignToken, VerifyToken} from "redcrypto/x/types.js"

import {DatabaseRaw} from "../types/database.js"
import {authApi} from "../../../features/auth/auth-api.js"
import {notesApi} from "../../../features/notes/api/notes-api.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {videosApi} from "../../../features/videos/api/videos-api.js"
import {exampleApi} from "../../../features/example/api/example-api.js"
import {Dacast} from "../../../features/videos/dacast/types/dacast-types.js"
import {questionsApi} from "../../../features/questions/api/questions-api.js"
import {prepareAuthPolicies} from "../../../features/auth/policies/prepare-auth-policies.js"
import {makeAdministrativeApi} from "../../../features/administrative/api/administrative-api.js"
import {SendLoginEmail} from "../../../features/auth/aspects/users/types/emails/send-login-email.js"
import {standardNicknameGenerator} from "../../../features/auth/utils/nicknames/standard-nickname-generator.js"

export async function assimilateApi({
		config, rando, databaseRaw, dacastSdk,
		sendLoginEmail, signToken, verifyToken,
	}: {
		databaseRaw: DatabaseRaw
		sendLoginEmail: SendLoginEmail
		signToken: SignToken
		verifyToken: VerifyToken
		dacastSdk: Dacast.Sdk
	} & AssimilatorOptions) {

	const generateNickname = standardNicknameGenerator({rando})

	const authPolicies = prepareAuthPolicies({
		config,
		databaseRaw,
		verifyToken,
	})

	return renraku.api({
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
		}),
		example: exampleApi({
			rando,
			config,
			authPolicies,
		}),
		videos: videosApi({
			config,
			dacastSdk,
			authPolicies,
		}),
		notes: notesApi({
			config,
			authPolicies,
		})
	})
}
