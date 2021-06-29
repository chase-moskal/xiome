
import {currySignToken} from "redcrypto/dist/curries/curry-sign-token.js"
import {curryVerifyToken} from "redcrypto/dist/curries/curry-verify-token.js"

import {ConfigKeys} from "../types/config-keys.js"

export function configureTokenFunctions(keys: "environment-variables" | ConfigKeys) {

	const cryptoKeys = keys === "environment-variables"
		? {
			public: process.env.XIOME_PUBLIC_KEY,
			private: process.env.XIOME_PRIVATE_KEY,
		}
		: keys

	return {
		signToken: currySignToken(cryptoKeys.private),
		verifyToken: curryVerifyToken(cryptoKeys.public),
	}
}
