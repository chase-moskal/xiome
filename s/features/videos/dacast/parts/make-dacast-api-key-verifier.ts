
import {Dacast} from "../types/dacast-types.js"

export function makeDacastApiKeyVerifier(getDacastClient: Dacast.GetClient): Dacast.VerifyApiKey {
	return async apiKey => {
		try {
			const dacast = getDacastClient(apiKey)
			await dacast.vods.get()
			return true
		}
		catch (error) {
			return false
		}
	}
}
