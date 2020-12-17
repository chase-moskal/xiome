
import {makeLoginTopic} from "./topics/login-topic.js"
import {makePersonalTopic} from "./topics/personal-topic.js"
import {AuthTables, VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "./auth-types.js"

import {Rando} from "../../toolbox/get-rando.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

export function makeAuthApi(options: {
			rando: Rando
			config: PlatformConfig
			authTables: AuthTables
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
		}) {

	// TODO implement permissions
	function getTables({appId}: {appId: string}): AuthTables {
		throw new Error("implement permissions hardcoding and whatever")
		return prepareConstrainTables(options.authTables)({appId})
	}

	return {
		loginTopic: makeLoginTopic({...options, getTables}),
		personalTopic: makePersonalTopic({...options, getTables}),
	}
}
