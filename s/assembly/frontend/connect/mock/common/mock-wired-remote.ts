
import {Await} from "../../../../../types/await.js"
import {mockRemote} from "../../../mocks/mock-remote.js"
import {MockLatency} from "../../../../../framework/add-mock-latency.js"
import {configureApiForNode} from "../../../../backend/configure-api-for-node.js"
import {wireMediatorBroadcastChannel} from "./wire-mediator-broadcast-channel.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockWiredRemote({
		apiLink, appId, storage, latency, appWindowLink, backend,
	}: {
		appId: string
		apiLink: string
		storage: FlexStorage
		latency: MockLatency
		appWindowLink: string
		backend: Await<ReturnType<typeof configureApiForNode>>
	}) {

	const {remote, authMediator} = mockRemote({
		appId,
		apiLink,
		storage,
		latency,
		api: backend.api,
		origin: new URL(appWindowLink).origin,
	})

	wireMediatorBroadcastChannel(authMediator)

	return {remote, authMediator}
}
