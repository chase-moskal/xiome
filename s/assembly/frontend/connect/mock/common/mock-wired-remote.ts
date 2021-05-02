
import {Await} from "../../../../../types/await.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {mockBackend} from "../../../../backend/mock-backend.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {wireMediatorBroadcastChannel} from "./wire-mediator-broadcast-channel.js"

export async function mockWiredRemote({
		apiLink, appId, storage, appWindowLink, backend,
	}: {
		appId: string
		apiLink: string
		storage: FlexStorage
		appWindowLink: string
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const {remote, authMediator} = mockRemote({
		appId,
		apiLink,
		storage,
		api: backend.api,
		origin: new URL(appWindowLink).origin,
		latency: {min: 200, max: 800},
	})

	wireMediatorBroadcastChannel(authMediator)

	return {remote, authMediator}
}
