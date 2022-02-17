
import {promisify} from "util"
import globCallback from "glob"
const glob = promisify(globCallback)

import {dirname, relative} from "path"
import {CommonBuildOptions} from "./build-types.js"
import {makeFileWriter} from "./build/file-writer.js"
import {escapeRegex} from "../toolbox/escape-regex.js"

const root = "x"
const htmlDirectory = "s/website/html"
const mode = <CommonBuildOptions["mode"]>process.argv[2]
const {write} = makeFileWriter(root)

if (!mode)
	console.error(`build requires argument "${mode}"`)

const htmlSources = await glob(
	`${htmlDirectory}/**/*.html.ts`,
	{ignore: `${htmlDirectory}/partials/**/*`},
)

const options: CommonBuildOptions = {mode, base: "."}

await Promise.all(htmlSources.map(async source => {
	const htmlDirectoryRegex = new RegExp("^" + escapeRegex(htmlDirectory) + "/")
	const module = source
		.replace(htmlDirectoryRegex, "./html/")
		.replace(/\.ts$/, ".js")
	const renderer = (await import(module)).default
	const destination = module
		.replace(/^\.\/html\//, "")
		.replace(/\.js$/, "")
	let base = relative(dirname(source), htmlDirectory)
	base = base === "" ? "." : base
	console.log(destination)
	await write(destination, await renderer({...options, base}))
}))
