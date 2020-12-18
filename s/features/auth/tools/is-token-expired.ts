
import {tokenDecode} from "redcrypto/dist/token-decode.js"

import {isTokenTimingExpired} from "./is-token-timing-expired.js"

export function isTokenExpired(token: string) {
	let expired = true

	if (token) {
		const decoded = tokenDecode<any>(token)
		expired = isTokenTimingExpired(decoded.exp)
	}

	return expired
}
