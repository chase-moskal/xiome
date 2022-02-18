
import {XiomeWebsiteContext} from "./build-types.js"
import {buildWebsite} from "../toolbox/hamster-html/website/build-website.js"

const mode = <XiomeWebsiteContext["mode"]>process.argv[2]
if (!mode) {
	console.error(`build requires argument "mode"`)
	process.exit(-1)
}

await buildWebsite<XiomeWebsiteContext>({
	inputDirectory: "x/website/html",
	outputDirectory: "x",
	excludes: ["partials/**/*"],
	context: {mode},
	logWrittenFile: path => console.log("compiled html", path),
})
