
import {makeFileWriter} from "./build/file-writer.js"

import indexHtml from "./html/index.html.js"
import setupHtml from "./html/setup.html.js"
import componentsHtml from "./html/components.html.js"
import legalHtml from "./html/legal.html.js"

const root = "x"
const mode = process.argv[2]
const {write} = makeFileWriter(root)

if (!mode)
	console.error(`build requires argument "${mode}"`)

const options = {mode, base: "."}
await Promise.all([
	write("index.html", indexHtml(options)),
	write("setup.html", setupHtml(options)),
	write("components.html", componentsHtml(options)),
	write("legal.html", legalHtml(options)),
])
