
import {makeLoginTopic} from "./topics/login-topic.js"

import {Rando} from "../../toolbox/get-rando.js"
import {ConstrainTables} from "../../toolbox/dbby/dbby-types.js"
import {AuthTables, VerifyToken, SignToken, PlatformConfig, SendEmail} from "./auth-types.js"

export function makeAuthApi(options: {
			rando: Rando
			config: PlatformConfig
			signToken: SignToken
			sendEmail: SendEmail
			verifyToken: VerifyToken
			generateNickname: () => string
			constrainTables: ConstrainTables<AuthTables>
		}) {
	return {
		loginTopic: makeLoginTopic(options),
	}
}
