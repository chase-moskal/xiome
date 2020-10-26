
export interface LoggerOptions {
	con?: Console
	colors?: Colors
	timestamp?: () => string
}

export interface Logger {
	log: typeof console.log
	info: typeof console.info
	debug: typeof console.debug
	warn: typeof console.warn
	error: typeof console.error
	clear: typeof console.clear
}

export type Colorizer = (...args: any[]) => string

export interface Colors {
	log: Colorizer
	info: Colorizer
	debug: Colorizer
	warn: Colorizer
	error: Colorizer
}
