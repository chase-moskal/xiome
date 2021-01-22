
const expiryRenewalCushion = 60 * 1000

export function isTokenTimingExpired(exp: number) {
	const expirySeconds = exp * 1000
	return Date.now() > (expirySeconds - expiryRenewalCushion)
}
