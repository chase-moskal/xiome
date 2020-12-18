
import {Rando} from "../toolbox/get-rando.js"
import {SystemTables} from "./assembly-types.js"
import {makeAuthApi} from "../features/auth/auth-api.js"
import {VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "../features/auth/auth-types.js"

export async function assembleBackend({tables, ...options}: {
			rando: Rando
			tables: SystemTables
			config: PlatformConfig
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
		}) {

	const authApi = makeAuthApi({
		...options,
		authTables: tables.auth,
	})

	return {authApi}
}
