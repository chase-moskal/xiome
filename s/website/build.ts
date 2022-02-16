
import {makeFileWriter} from "./build/file-writer.js"
import indexHtml from "./html/index.html.js"

const root = "x"
const mode = process.argv[2]
const {write} = makeFileWriter(root)

if (!mode)
	console.error(`build requires argument "${mode}"`)

await write("index.html", indexHtml({mode, base: "."}))
