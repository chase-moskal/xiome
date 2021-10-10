
import {Dacast} from "../types/dacast-types.js"
import {mockDacastClient} from "./parts/mock-dacast-client.js"
import {mockVerifyDacastApiKey} from "./parts/mock-verify-dacast-api-key.js"

export function mockDacastSdk({goodApiKey}: {goodApiKey: string}): Dacast.Sdk {

	const getClient: Dacast.GetClient = apiKey =>
		mockDacastClient({goodApiKey})({apiKey})

	return {
		getClient,
		verifyApiKey: mockVerifyDacastApiKey({goodApiKey}),
	}
}
