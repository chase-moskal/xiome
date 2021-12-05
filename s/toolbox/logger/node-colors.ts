
import {Chalk, ChalkInstance} from "chalk"
import {Colors, Colorizer} from "./interfaces.js"

export function nodeColors(force?: boolean): Colors {
	let chalkstick: ChalkInstance

	if (force === true)
		chalkstick = new Chalk({level: 1})
	else if (force === false)
		chalkstick = new Chalk({level: 0})
	else
		chalkstick = new Chalk()

	const bind = <T extends Colorizer>(colorfunc: T) =>
		colorfunc.bind(chalkstick)

	return {
		log: bind(chalkstick.cyan),
		info: bind(chalkstick.cyanBright),
		debug: bind(chalkstick.blueBright),
		warn: bind(chalkstick.yellow),
		error: bind(chalkstick.redBright),
	}
}
