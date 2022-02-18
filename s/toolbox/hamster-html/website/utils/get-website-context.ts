
import {dirname, relative, resolve} from "path"
import {WebsiteContext} from "../build-website-types.js"
import {hashVersioner} from "../../versioning/hash-versioner.js"

export function getWebsiteContext({
		sourcePath,
		inputDirectory,
		outputDirectory,
	}: {
		sourcePath: string
		inputDirectory: string
		outputDirectory: string
	}): WebsiteContext {

	let base = relative(dirname(sourcePath), inputDirectory)
	base = base === ""
		? "."
		: base

	return {
		base,
		v: hashVersioner({
			root: outputDirectory,
			origin: relative(
				resolve(inputDirectory),
				dirname(resolve(sourcePath))
			),
		})
	}
}
