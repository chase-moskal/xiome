
import {makeLoginTopic} from "./topics/login-topic.js"

import {Rando} from "../../toolbox/get-rando.js"
import {ConstrainTables} from "../../toolbox/dbby/dbby-types.js"
import {CoreTables, VerifyToken, SignToken, PlatformConfig, SendEmail} from "./auth-types.js"

export function makeAuthApi(options: {
			rando: Rando
			config: PlatformConfig
			signToken: SignToken
			sendEmail: SendEmail
			verifyToken: VerifyToken
			generateNickname: () => string
			constrainTables: ConstrainTables<CoreTables>
		}) {
	return {
		loginTopic: makeLoginTopic(options),
	}
}
