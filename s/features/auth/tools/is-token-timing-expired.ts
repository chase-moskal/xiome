
import {expiryRenewalCushion} from "../constants.js"

export function isTokenTimingExpired(exp: number) {
	const expirySeconds = exp * 1000
	return Date.now() > (expirySeconds - expiryRenewalCushion)
}
