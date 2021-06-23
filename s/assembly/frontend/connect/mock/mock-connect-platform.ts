
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockBackend} from "../../../backend/mock-backend.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockConfig} from "../../../backend/mock-config.js"

export async function mockConnectPlatform({
		platformHome, storage,
	}: {
		platformHome: string
		storage: FlexStorage
	}) {

	const backend = await mockBackend(mockConfig())

	const apiLink = apiOrigin + "/"
	const appId = backend.platformAppId

	const {remote, authMediator} = await mockWiredRemote({
		appId,
		apiLink,
		backend,
		storage,
		appWindowLink: platformHome,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {appId, remote, authMediator, backend, popups}
}
