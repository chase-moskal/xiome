
import { asApi } from "renraku/x/identities/as-api.js"

import {Rando} from "../toolbox/get-rando.js"
import {SystemTables} from "./assembly-types.js"
import {makeAuthApi} from "../features/auth/new-auth-api.js"
import {prepareAuthPolicies} from "../features/auth/policies/prepare-auth-policies.js"
import {VerifyToken, SignToken, PlatformConfig, SendLoginEmail} from "../features/auth/auth-types.js"
import {prepareAuthTablesPermissionsAndConstraints} from "../features/auth/permissions/tables/prepare-auth-tables-permissions-and-constraints.js"

export function makeWholeApi(options: {
		rando: Rando
		tables: SystemTables
		config: PlatformConfig
		signToken: SignToken
		verifyToken: VerifyToken
		sendLoginEmail: SendLoginEmail
		generateNickname: () => string
	}) {

	const {config, tables, verifyToken} = options

	return asApi({
		auth: makeAuthApi({
			...options,
			policies: prepareAuthPolicies({
				verifyToken,
				getAuthTables: prepareAuthTablesPermissionsAndConstraints({
					config,
					authTables: tables.auth,
				}),
			}),
		}),
	})
}
