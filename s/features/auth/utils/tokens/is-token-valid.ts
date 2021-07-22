
import {tokenDecode} from "redcrypto/x/token-decode.js"
import {isTokenTimingExpired} from "./is-token-timing-expired.js"

export function isTokenValid(token: string | undefined) {
	return !!token
		&& !isTokenTimingExpired(tokenDecode(token).data.exp)
}
