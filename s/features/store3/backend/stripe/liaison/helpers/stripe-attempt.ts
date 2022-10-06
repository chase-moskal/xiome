
import type Stripe from "stripe"

export async function stripeAttempt<R extends Stripe.Response<any>>(
		stripeCall: () => Promise<R>
	): Promise<R | undefined> {

	try {
		const response = await stripeCall()
		return response
	}
	catch (error) {
		const is404 = (
			error instanceof Error &&
			(<any>error).statusCode === 404
		)
		if (is404)
			return undefined
		else
			throw error
	}
}
