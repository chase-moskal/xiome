
import {nodeColors} from "./node-colors.js"
import {makeLogger} from "./make-logger.js"
import {LoggerOptions} from "./interfaces.js"

export function makeNodeLogger({
		con,
		timestamp,
		colors = nodeColors()
	}: LoggerOptions = {}) {
	return makeLogger({con, colors, timestamp})
}
