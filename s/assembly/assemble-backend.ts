
import {Rando} from "../toolbox/get-rando.js"
import {SystemTables} from "./assembly-types.js"
import {makeAuthApi} from "../features/auth/new-auth-api.js"
import {preparePolicies} from "../features/auth/policies/prepare-auth-policies.js"
import {VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "../features/auth/auth-types.js"
import { dbbyConstrain } from "../toolbox/dbby/dbby-constrain.js"

export async function assembleBackend({verifyToken, tables, ...options}: {
			rando: Rando
			tables: SystemTables
			config: PlatformConfig
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
		}) {

	// TODO table constraints

	const policies = preparePolicies({
		verifyToken,
		getTables: ({appId}) => dbbyConstrain(tables.auth, {appId})
	})

	const authApi2 = makeAuthApi({
		options: {},
		policies: {},
	})

	const authApi = makeAuthApi({
		...options,
		authTables: tables.auth,
	})

	return {authApi}
}
