
import {pub} from "./pub.js"
import {Logger} from "./logger/interfaces.js"

export function deathWithDignity({logger = console}: {
		logger?: Logger
	} = {}) {

	const deathEvent = pub()

	process.on("SIGINT", () => {
		logger.log("💣 SIGINT")
		deathEvent.publish()
		process.exit(0)
	})
	
	process.on("SIGTERM", () => {
		logger.log("🗡️ SIGTERM")
		deathEvent.publish()
		process.exit(0)
	})

	process.on("uncaughtException", error => {
		logger.error("🚨 unhandled exception:", error)
		deathEvent.publish()
		process.exit(1)
	})

	process.on("unhandledRejection", (reason, error) => {
		logger.error("🚨 unhandled rejection:", reason, error)
		deathEvent.publish()
		process.exit(1)
	})

	return {
		onDeath: deathEvent.subscribe,
	}
}
