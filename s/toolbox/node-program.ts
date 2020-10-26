
import {Logger} from "./logger/interfaces.js"
import {deathWithDignity} from "./death-with-dignity.js"
import {makeNodeLogger} from "./logger/make-node-logger.js"

export type Main = ({logger}: {logger: Logger}) => Promise<void>

export function nodeProgram(main: Main) {
	const logger = makeNodeLogger()
	deathWithDignity({logger})
	main({logger}).catch(error => {
		logger.error("\u274C ERROR")
		logger.error(error)
		process.exit(1)
	})
}
