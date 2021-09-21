
import {VerifyApiKey} from "./types/dacast-types.js"
import {makeDacastClient} from "./make-dacast-client.js"

export const verifyDacastApiKey: VerifyApiKey = async apiKey => {
	const dacastClient = makeDacastClient({apiKey})
	try {
		await dacastClient.channels.get()
		return true
	}
	catch (error) {
		return false
	}
}
