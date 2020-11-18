
import {makeLoginTopic} from "./topics/login-topic.js"

import {Rando} from "../../toolbox/get-rando.js"
import {ConstrainTables} from "../../toolbox/dbby/dbby-types.js"
import {AuthTables, VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "./auth-types.js"

export function makeAuthApi(options: {
			rando: Rando
			config: PlatformConfig
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
			constrainTables: ConstrainTables<AuthTables>
		}) {
	return {
		loginTopic: makeLoginTopic(options),
	}
}
