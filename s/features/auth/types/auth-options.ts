
import {SignToken, VerifyToken} from "redcrypto/x/types.js"

import {Rando} from "dbmage"
import {prepareAuthPolicies} from "../policies/prepare-auth-policies.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {SendLoginEmail} from "../aspects/users/types/emails/send-login-email.js"

export interface AuthOptions {
	rando: Rando
	config: SecretConfig
	authPolicies: ReturnType<typeof prepareAuthPolicies>
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
