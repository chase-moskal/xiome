
import {Await} from "../../../../../types/await.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {backendForNode} from "../../../../backend/backend-for-node.js"
import {wireMediatorBroadcastChannel} from "./wire-mediator-broadcast-channel.js"
import {FlexStorage} from "dbmage"

export async function mockWiredRemote({
		appId, appOrigin, storage, backend,
	}: {
		appId: string
		appOrigin: string
		storage: FlexStorage
		backend: Await<ReturnType<typeof backendForNode>>
	}) {

	const {remote, authMediator, setMockLatency} = mockRemote({
		appId,
		storage,
		logging: true,
		api: backend.api,
		headers: {origin: appOrigin},
	})

	wireMediatorBroadcastChannel({appId, authMediator})

	return {remote, authMediator, setMockLatency}
}
