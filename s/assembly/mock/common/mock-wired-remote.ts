
import {Await} from "../../../types/fancy.js"
import {mockBackend} from "../../backend/mock-backend.js"
import {mockRemote} from "../../frontend/mocks/mock-remote.js"
import {SimpleStorage} from "../../../toolbox/json-storage.js"
import {makeTokenStore2} from "../../../features/auth/goblin/token-store2.js"

export async function mockWiredRemote({
		apiLink, appId, platformHome, tableStorage, backend,
	}: {
		appId: string
		apiLink: string
		platformHome: string
		tableStorage: SimpleStorage
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const channel = new BroadcastChannel("tokenChangeEvent")
	const publishTokenChange = () => channel.postMessage(undefined)

	const {remote, authGoblin} = mockRemote({
		appId,
		apiLink,
		api: backend.api,
		origin: new URL(platformHome).origin,
		latency: {min: 200, max: 800},
		tokenStore: makeTokenStore2({
			appId,
			storage: tableStorage,
			publishAppTokenChange: publishTokenChange,
			publishAuthTokenChange: publishTokenChange,
		}),
	})

	channel.onmessage = authGoblin.refreshFromStorage

	return {remote, authGoblin}
}
