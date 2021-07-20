
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {isTokenTimingExpired} from "./is-token-timing-expired.js"

export function isTokenValid(token: string | undefined) {
	return !!token
		&& !isTokenTimingExpired(tokenDecode(token).exp)
}
