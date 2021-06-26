
import {currySignToken} from "redcrypto/dist/curries/curry-sign-token.js"
import {curryVerifyToken} from "redcrypto/dist/curries/curry-verify-token.js"

import {ConfigKeys} from "../types/config-keys.js"

export function configureTokenFunctions(keys: ConfigKeys) {
	return {
		signToken: currySignToken(keys.private),
		verifyToken: curryVerifyToken(keys.public),
	}
}
