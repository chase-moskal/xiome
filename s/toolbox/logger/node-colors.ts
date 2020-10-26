
import chalk, {Chalk} from "chalk"
import {Colors, Colorizer} from "./interfaces.js"

export function nodeColors(force?: boolean): Colors {
	let chalkstick: Chalk

	if (force === true)
		chalkstick = new chalk.Instance({level: 1})
	else if (force === false)
		chalkstick = new chalk.Instance({level: 0})
	else
		chalkstick = new chalk.Instance()

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
