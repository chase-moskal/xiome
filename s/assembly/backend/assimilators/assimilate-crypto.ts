
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

export function assimilateCrypto({
		config,
		configureTokenFunctions,
	}: AssimilatorOptions) {

	if (config.crypto.keys === "mock-mode") {
		return {
			signToken: mockSignToken(),
			verifyToken: mockVerifyToken(),
		}
	}
	else {
		return configureTokenFunctions(config.crypto.keys)
	}
}
