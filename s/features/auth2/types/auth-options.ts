
import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {SendLoginEmail} from "../aspects/users/types/emails/send-login-email.js"
import {prepareAuthPolicies} from "../policies/prepare-auth-policies.js"

export interface AuthOptions {
	rando: Rando
	config: SecretConfig
	authPolicies: ReturnType<typeof prepareAuthPolicies>
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
