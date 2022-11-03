
import Stripe from "stripe"
import {objectMap} from "@chasemoskal/snapstate"

// TODO implement this into the stripe liaison?

export class RetryFailedError extends Error {}

export function setupStripeRateLimitRetrying({
	maxRetries,
	maxWaitPeriod,
	}: {
		maxRetries: number
		maxWaitPeriod: number
	}) {

	let retries = 1

	function reset() {
		retries = 1
	}

	async function wait() {
		retries += 1

		if (retries > maxRetries)
			throw new RetryFailedError()

		const howLong = (2 ** retries) * 1000
		const reallyHowLong =
			(howLong > maxWaitPeriod)
				? maxWaitPeriod
				: howLong

		return new Promise(resolve => setTimeout(resolve, reallyHowLong))
	}

	type Funcs = {[key: string]: (...args: any[]) => Promise<any>}

	return function handleStripeRateLimitingErrors<xFuncs extends Funcs>(
			funcs: xFuncs
		) {

		return objectMap(funcs, func => (
			async function attempt(...args: any[]) {
				try {
					const result = func(...args)
					reset()
					return result
				}
				catch (error) {
					if (error instanceof Stripe.errors.StripeRateLimitError) {
						await wait()
						return attempt(...args)
					}
					else
						throw error
				}
			}
		))
	}
}
