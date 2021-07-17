
import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {AuthTables} from "./auth-tables.js"
import {Rando} from "../../../toolbox/get-rando.js"
import {basicPolicies} from "../policies/basic-policies.js"
import {AppTables} from "../aspects/apps/types/app-tables.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {SendLoginEmail} from "../aspects/users/types/emails/send-login-email.js"

export interface CommonAuthOptions {
	rando: Rando
	config: SecretConfig
	basicPolicies: ReturnType<typeof basicPolicies>
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}

export interface AuthApiOptions extends CommonAuthOptions {
	appTables: AppTables
	authTables: AuthTables
}
