
const expiryRenewalCushion = 60 * 1000

export function isTokenTimingExpired(exp: number) {
	const expiry = exp * 1000
	return Date.now() > (expiry - expiryRenewalCushion)
}
