
import { Await } from "../../../types/fancy.js"
import { mockBackend } from "../../backend/mock-backend.js"
import { mockRemote } from "../../frontend/mocks/mock-remote.js"
import { SimpleStorage } from "../../../toolbox/json-storage.js"
import { makeTokenStore2 } from "../../../features/auth/goblin/token-store2.js"

export async function mockWiredRemote({
		apiLink, appToken, platformHome, tableStorage, backend,
	}: {
		apiLink: string
		appToken: string
		platformHome: string
		tableStorage: SimpleStorage
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const channel = new BroadcastChannel("tokenChangeEvent")

	const {remote, authGoblin} = mockRemote({
		apiLink,
		appToken,
		api: backend.api,
		origin: new URL(platformHome).origin,
		latency: {min: 200, max: 800},
		tokenStore: makeTokenStore2({
			storage: tableStorage,
			publishTokenChange: () => channel.postMessage(undefined),
		}),
	})

	channel.onmessage = authGoblin.refreshFromStorage

	return {remote, authGoblin}
}
