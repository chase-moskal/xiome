
import {Middleware} from "koa"
import {Logger} from "./logger/interfaces.js"
import {httpHandler} from "./http-handler.js"

export const health = ({
	logger,
	path = "/health",
	result = "healthy",
}: {
	path?: string
	result?: string
	logger?: Logger
} = {}): Middleware => httpHandler("get", path, async() => {
	if (logger) logger.log("health check")
	return result
})
