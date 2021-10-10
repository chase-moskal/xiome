
import {makeDacastSdk} from "./features/videos/dacast/make-dacast-sdk.js"

async function log<R>(title: string, f: () => Promise<R>) {
	let result: R
	try {
		result = await f()
		console.log("\n\n" + title, JSON.stringify(result, undefined, "\t"))
	}
	catch (error) {
		console.log("\n\n" + title, error)
	}
	return result
}

////////

const apiKey = (process.argv[2] ?? "").trim()
if (!apiKey.length)
	throw new Error("api key argument required")


const dacastSdk = makeDacastSdk()

const valid = await dacastSdk.verifyApiKey(apiKey)
console.log("api key:", {valid})

const dacast = dacastSdk.getClient(apiKey)

//
// vods test
//

const vods = await log("vods", () => dacast.vods.get())
if (vods.data.length) {
	const {id} = vods.data[0]
	await log("vod", () => dacast.vods.id(id).get())
	await log("vod embed iframe", () => dacast.vods.id(id).embed("iframe").get())
	await log("vod embed javascript", () => dacast.vods.id(id).embed("javascript").get())
}
else console.log("no vods")

//
// playlists test
//

const playlists = await log("playlists", () => dacast.playlists.get())
if (playlists.data.length) {
	const {id} = playlists.data[0]
	await log("playlist", () => dacast.playlists.id(id).get())
	await log("playlist embed iframe", () => dacast.playlists.id(id).embed("iframe").get())
	await log("playlist embed javascript", () => dacast.playlists.id(id).embed("javascript").get())
}
else console.log("no playlists")

//
// channels test
//

const channels = await log("channels", () => dacast.channels.get())
if (channels.data.length) {
	const {id} = channels.data[0]
	await log("channel", () => dacast.channels.id(id).get())
	await log("channel embed iframe", () => dacast.channels.id(id).embed("iframe").get())
	await log("channel embed javascript", () => dacast.channels.id(id).embed("javascript").get())
}
else console.log("no channels")
