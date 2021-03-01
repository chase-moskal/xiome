
import {Await} from "../../../../../types/await.js"
import {mockBackend} from "../../../../backend/mock-backend.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {makeTokenStore2} from "../../../../../features/auth/goblin/token-store2.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockWiredRemote({
		apiLink, appId, appWindowLink, tableStorage, backend,
	}: {
		appId: string
		apiLink: string
		appWindowLink: string
		tableStorage: FlexStorage
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const channel = new BroadcastChannel("tokenChangeEvent")
	const publishTokenChange = () => channel.postMessage(undefined)

	const {remote, authGoblin} = mockRemote({
		appId,
		apiLink,
		api: backend.api,
		origin: new URL(appWindowLink).origin,
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
