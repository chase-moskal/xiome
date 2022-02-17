
import {CommonBuildOptions} from "./build-types.js"
import {buildWebsite} from "./build/build-website.js"

const mode = <CommonBuildOptions["mode"]>process.argv[2]
if (!mode)
	console.error(`build requires argument "${mode}"`)

await buildWebsite<CommonBuildOptions>({
	inputDirectory: "x/website/html",
	outputDirectory: "x",
	options: {
		mode,
	},
	logWrittenFile: path => console.log("compiled html", path)
})
