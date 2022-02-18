
import {promisify} from "util"
import globCallback from "glob"
const glob = promisify(globCallback)
import {relative, dirname, resolve, join} from "path"

import {escapeRegex} from "../../escape-regex.js"
import {makeFileWriter} from "./utils/file-writer.js"
import {WebsiteContext} from "./build-website-types.js"
import {hashVersioner} from "../versioning/hash-versioner.js"
import {getWebsiteContext} from "./utils/get-website-context.js"

export async function buildWebsite<xOptions extends WebsiteContext>({
		inputDirectory,
		outputDirectory,
		context,
		excludes,
		logWrittenFile = () => {},
	}: {
		inputDirectory: string
		outputDirectory: string
		context: Omit<xOptions, keyof WebsiteContext>
		excludes: string[]
		logWrittenFile?(path: string): void
	}) {

	const {write} = makeFileWriter(outputDirectory)

	const htmlSources = await glob(
		`${inputDirectory}/**/*.html.js`,
		{ignore: excludes.map(exclude => join(inputDirectory, exclude))},
	)

	await Promise.all(htmlSources.map(async sourcePath => {
		const htmlDirectoryRegex = new RegExp("^" + escapeRegex(inputDirectory) + "/")
		const buildDirectory = dirname(import.meta.url.replace(/^file:\/\/\//, "/"))
		const targetModule = resolve(sourcePath)
		const modulePath = relative(buildDirectory, targetModule)
		const renderer = (await import(modulePath)).default
		const destination = sourcePath
			.replace(htmlDirectoryRegex, "./html/")
			.replace(/^\.\/html\//, "")
			.replace(/\.js$/, "")

		const providedContext: WebsiteContext = {
			...getWebsiteContext({sourcePath, inputDirectory, outputDirectory}),
			...context,
		}
		const resultHtml = await (await renderer(providedContext)).render()
		await write(destination, resultHtml)
		logWrittenFile(resolve(destination))
	}))
}
