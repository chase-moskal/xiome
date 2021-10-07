
import {Dacast} from "./features/videos/dacast/types/dacast-types.js"
import {makeDacastClient} from "./features/videos/dacast/make-dacast-client.js"
import {makeDacastApiKeyVerifier} from "./features/videos/dacast/make-dacast-api-key-verifier.js"

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
	throw new Error("api key argument required")

const getDacastClient: Dacast.GetClient = apiKey => makeDacastClient({apiKey})
const verifyDacastApiKey = makeDacastApiKeyVerifier(getDacastClient)

const valid = await verifyDacastApiKey(apiKey)
console.log({valid})

const dacast = makeDacastClient({apiKey})
await logAbout("\n\nvods", () => dacast.vods.get())
await logAbout("\n\nplaylists", () => dacast.playlists.get())
await logAbout("\n\nchannels", () => dacast.channels.get())
