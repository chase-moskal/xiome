
import {makeFileWriter} from "./build/file-writer.js"

import {promisify} from "util"
import globCallback from "glob"
import {CommonBuildOptions} from "./build-types.js"
const glob = promisify(globCallback)

const root = "x"
const mode = <CommonBuildOptions["mode"]>process.argv[2]
const {write} = makeFileWriter(root)

if (!mode)
	console.error(`build requires argument "${mode}"`)

const htmlSources = await glob(
	`s/website/html/**/*.html.ts`,
	{ignore: `s/website/html/partials/**/*`},
)

const options: CommonBuildOptions = {mode, base: "."}

await Promise.all(htmlSources.map(async source => {
	source = source
		.replace(/^s\/website\//, "./")
		.replace(/\.ts$/, ".js")
	const renderer = (await import(source)).default
	const destination = source
		.replace(/^\.\/html\//, "")
		.replace(/\.js$/, "")
	console.log(destination)
	await write(destination, await renderer(options))
}))
