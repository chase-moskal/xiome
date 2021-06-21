
import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {SendLoginEmail} from "./emails/send-login-email.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"

export interface AuthApiOptions {
	rando: Rando
	config: SecretConfig
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
