
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

export function assimilateCrypto({
		config,
		configureTokenFunctions,
	}: Pick<AssimilatorOptions, "config" | "configureTokenFunctions">) {

	return config.crypto.keys === "mock-mode"
		? {
			signToken: mockSignToken(),
			verifyToken: mockVerifyToken(),
		}
		: configureTokenFunctions(config.crypto.keys)
}
