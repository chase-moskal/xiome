
import {makeDacastClient} from "./features/videos/dacast/make-dacast-client.js"
import {verifyDacastApiKey} from "./features/videos/dacast/verify-dacast-api-key.js"

const apiKey = ""

async function attempt(f: () => Promise<any>) {
	try { return f() }
	catch (error) { console.error(error) }
}


const dacast = makeDacastClient({apiKey})
const valid = await verifyDacastApiKey(apiKey)

console.log({valid})

const vods = await attempt(() => dacast.vods.get())
const channels = await attempt(() => dacast.channels.get())
const playlists = await attempt(() => dacast.playlists.get())

console.log({
	vods,
	channels,
	playlists,
})
