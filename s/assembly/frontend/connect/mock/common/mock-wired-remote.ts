
import {Await} from "../../../../../types/await.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {backendForNode} from "../../../../backend/backend-for-node.js"
import {wireMediatorBroadcastChannel} from "./wire-mediator-broadcast-channel.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockWiredRemote({
		apiLink, appId, storage, appWindowLink, backend,
	}: {
		appId: string
		apiLink: string
		storage: FlexStorage
		appWindowLink: string
		backend: Await<ReturnType<typeof backendForNode>>
	}) {

	const {remote, authMediator} = mockRemote({
		appId,
		apiLink,
		storage,
		api: backend.api,
		origin: new URL(appWindowLink).origin,
	})

	wireMediatorBroadcastChannel({appId, authMediator})

	return {remote, authMediator}
}
