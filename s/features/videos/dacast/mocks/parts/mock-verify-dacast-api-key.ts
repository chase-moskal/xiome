
import {Dacast} from "../../types/dacast-types.js"

export function mockVerifyDacastApiKey({goodApiKey}: {
		goodApiKey: string
	}): Dacast.VerifyApiKey {

	return async apiKey => apiKey === goodApiKey
}
