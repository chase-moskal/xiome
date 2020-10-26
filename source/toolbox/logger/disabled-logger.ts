
import {Logger} from "./interfaces.js"

const noop = (...args: any[]) => {}

export class DisabledLogger implements Logger {
	log = noop
	info = noop
	debug = noop
	warn = noop
	error = noop
	clear = noop
}
