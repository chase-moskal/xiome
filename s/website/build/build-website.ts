
import {promisify} from "util"
import globCallback from "glob"
const glob = promisify(globCallback)

import {relative, dirname, resolve} from "path"
import {BuildOptions} from "../build-types.js"
import {makeFileWriter} from "./file-writer.js"
import {escapeRegex} from "../../toolbox/escape-regex.js"

export async function buildWebsite<xOptions extends BuildOptions>({
		inputDirectory,
		outputDirectory,
		options,
		logWrittenFile = () => {},
	}: {
		inputDirectory: string
		outputDirectory: string
		options: Omit<xOptions, keyof BuildOptions>
		logWrittenFile?(path: string): void
	}) {

	const {write} = makeFileWriter(outputDirectory)

	const htmlSources = await glob(
		`${inputDirectory}/**/*.html.js`,
		{ignore: `${inputDirectory}/partials/**/*`},
	)

	await Promise.all(htmlSources.map(async source => {
		const htmlDirectoryRegex = new RegExp("^" + escapeRegex(inputDirectory) + "/")
		const buildModule = import.meta.url.replace(/^file:\/\/\//, "/")
		const targetModule = resolve(source)
		const module = relative(dirname(buildModule), targetModule)
		const renderer = (await import(module)).default
		const destination = source
			.replace(htmlDirectoryRegex, "./html/")
			.replace(/^\.\/html\//, "")
			.replace(/\.js$/, "")
		let base = relative(dirname(source), inputDirectory)
		base = base === "" ? "." : base
		const resultHtml = await (await renderer({...options, base})).render()
		await write(destination, resultHtml)
		logWrittenFile(resolve(destination))
	}))
}
