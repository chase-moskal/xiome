
import {mockPopups} from "./common/mock-popups.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
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

	const appId = backend.platformAppId

	const {remote, authMediator} = await mockWiredRemote({
		appId,
		backend,
		storage,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	const chatConnect = await chatMockClient({storage})

	return {appId, remote, storage, authMediator, backend, popups, chatConnect}
}
