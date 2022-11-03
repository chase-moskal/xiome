
const maxExpiryRenewalCushion = 60 * 1000

export function isTokenTimingExpired({exp, iat}: {
		exp: number
		iat: number
	}) {

	const lifespan = (exp - iat) * 1000
	const expiry = exp * 1000

	const tenth = lifespan / 10
	const cushion = tenth > maxExpiryRenewalCushion
		? maxExpiryRenewalCushion
		: tenth

	return Date.now() > (expiry - cushion)
}
