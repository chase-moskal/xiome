
import {Await} from "../../../../../types/await.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {backendForNode} from "../../../../backend/backend-for-node.js"
import {wireMediatorBroadcastChannel} from "./wire-mediator-broadcast-channel.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockWiredRemote({
		appId, storage, backend,
	}: {
		appId: string
		storage: FlexStorage
		backend: Await<ReturnType<typeof backendForNode>>
	}) {

	const {remote, authMediator} = mockRemote({
		appId,
		storage,
		api: backend.api,
	})

	wireMediatorBroadcastChannel({appId, authMediator})

	return {remote, authMediator}
}
