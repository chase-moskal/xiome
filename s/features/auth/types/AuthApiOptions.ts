import {SignToken, VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../toolbox/get-rando.js"
import {PlatformConfig} from "./PlatformConfig.js"
import {SendLoginEmail} from "./SendLoginEmail.js"


export interface AuthApiOptions {
	rando: Rando
	config: PlatformConfig
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
