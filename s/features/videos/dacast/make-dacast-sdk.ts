
import {Dacast} from "./types/dacast-types.js"
import {makeDacastClient} from "./parts/make-dacast-client.js"
import {makeDacastApiKeyVerifier} from "./parts/make-dacast-api-key-verifier.js"

export function makeDacastSdk({headers = {}}: {
		headers?: Partial<Dacast.Headers>
	} = {}) {

	const getClient: Dacast.GetClient = apiKey => makeDacastClient({
		apiKey,
		headers,
	})

	return {
		getClient,
		verifyApiKey: makeDacastApiKeyVerifier(getClient)
	}
}
