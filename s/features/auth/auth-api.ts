
import {makeLoginTopic} from "./topics/login-topic.js"
import {makePersonalTopic} from "./topics/personal-topic.js"
import {AuthTables, VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "./auth-types.js"
import {prepareAuthTablesPermissionsAndConstraints} from "./permissions/tables/prepare-auth-tables-permissions-and-constraints.js"

import {Rando} from "../../toolbox/get-rando.js"

export function makeAuthApi(options: {
			rando: Rando
			config: PlatformConfig
			authTables: AuthTables
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
		}) {

	const getTables = prepareAuthTablesPermissionsAndConstraints(options)

	return {
		loginTopic: makeLoginTopic({...options, getTables}),
		personalTopic: makePersonalTopic({...options, getTables}),
	}
}
