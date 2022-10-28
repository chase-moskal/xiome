
import type Stripe from "stripe"
import {objectMap} from "@chasemoskal/snapstate"

export function stripeAttempt<
		xObj extends {[key: string]: (...args: any[]) => Stripe.Response<any>}
	>(obj: xObj): xObj {

	return <xObj>objectMap(
		obj,
		stripeFunc => (
			async(...args: any[]) =>
				returnUndefinedOn404(async() => stripeFunc(...args))
		)
	)
}

async function returnUndefinedOn404<R extends Stripe.Response<any>>(
		stripeCall: () => Promise<R>
	): Promise<R | undefined> {

	try {
		return await stripeCall()
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
