
import {makeDacastClient} from "./features/videos/dacast/make-dacast-client.js"
import {verifyDacastApiKey} from "./features/videos/dacast/verify-dacast-api-key.js"

async function logAbout(title: string, f: () => Promise<any>) {
	try {
		console.log(title, await f())
	}
	catch (error) {
		console.log(title, error)
	}
}

////////

const apiKey = (process.argv[2] ?? "").trim()

if (!apiKey.length)
	console.error("api key argument required")

const valid = await verifyDacastApiKey(apiKey)
console.log({valid})

const dacast = makeDacastClient({apiKey})
await logAbout("\n\nvods", () => dacast.vods.get())
await logAbout("\n\nplaylists", () => dacast.playlists.get())
await logAbout("\n\nchannels", () => dacast.channels.get())
