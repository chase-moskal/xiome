
import {Middleware} from "koa"

export function httpHandler(
	method = "get",
	url: string,
	handler: () => Promise<string>
): Middleware {
	return async(context, next) => {
		const methodIsHead = context.method.toLowerCase() === "head"
		const methodMatches = context.method.toLowerCase() === method.toLowerCase()
		const validMethod = methodIsHead || methodMatches
		if (validMethod && context.url === url) {
			const body = await handler()
			context.response.body = body
		}
		else await next()
	}
}
