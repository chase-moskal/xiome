
import {timestamp as defaultTimestamp} from "./timestamp.js"
import {Colors, Logger, LoggerOptions} from "./interfaces.js"

export function makeLogger({
		con = console,
		colors = noColors(),
		timestamp = defaultTimestamp
	}: LoggerOptions = {}): Logger {

	const prepare = (
		logfunc: (...args: any[]) => void,
		colorfunc: (...args: any[]) => string
	) => (...args: any[]) => logfunc.call(
		con,
		colorfunc(timestamp()),
		...args
	)

	return {
		log: prepare(con.log, colors.log),
		info: prepare(con.info, colors.info),
		debug: prepare(con.debug, colors.debug),
		warn: prepare(con.warn, colors.warn),
		error: prepare(con.error, colors.error),
		clear: () => con.clear(),
	}
}

function noColors(): Colors {
	const noop = () => (...args: any[]) => args.join(" ")
	return {
		log: noop(),
		info: noop(),
		debug: noop(),
		warn: noop(),
		error: noop(),
	}
}
