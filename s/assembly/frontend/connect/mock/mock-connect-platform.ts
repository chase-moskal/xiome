
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {chatMockClient} from "../../../../features/chat/api/sockets/chat-mock-client.js"

export async function mockConnectPlatform({
		platformHome, storage,
	}: {
		platformHome: string
		storage: FlexStorage
	}) {

	const backend = await backendForBrowser(storage)(mockConfig({
		platformHome,
		platformOrigins: [new URL(platformHome).origin],
	}))

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

	const chatConnect = await chatMockClient({storage})

	return {appId, remote, storage, authMediator, backend, popups, chatConnect}
}
