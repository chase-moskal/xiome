
import {makeFileWriter} from "./build/file-writer.js"

import indexHtml from "./html/index.html.js"
import setupHtml from "./html/setup.html.js"
import componentsHtml from "./html/components.html.js"
import legalHtml from "./html/legal.html.js"

import chatHtml from "./html/mocksite/chat.html.js"
import mocksiteHtml from "./html/mocksite/index.html.js"
import notesHtml from "./html/mocksite/notes.html.js"
import videosHtml from "./html/mocksite/videos.html.js"

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

	write("mocksite/index.html", mocksiteHtml(options)),
	write("mocksite/chat.html", chatHtml(options)),
	write("mocksite/notes.html", notesHtml(options)),
	write("mocksite/videos.html", videosHtml(options)),
])
