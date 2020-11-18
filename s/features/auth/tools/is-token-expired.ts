
import {tokenDecode} from "redcrypto/dist/token-decode.js"

export function isTokenExpired(token: string, expiryRenewalCushion: number) {
	let expired = true

	if (token) {
		const decoded = tokenDecode<any>(token)
		const expiry = decoded.exp * 1000
		expired = Date.now() > (expiry - expiryRenewalCushion)
	}

	return expired
}
