
import {FlexStorage} from "dbmage"

import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {chatMockClientEntirely} from "../../../../features/chat/api/sockets/chat-mock-client-entirely.js"

export async function mockConnectPlatform({
		root, platformHome, storage,
	}: {
		root: string
		platformHome: string
		storage: FlexStorage
	}) {

	const appOrigin = new URL(platformHome).origin

	const backend = await backendForBrowser(storage)(mockConfig({
		root,
		platformHome,
		platformOrigins: [appOrigin],
	}))

	const appId = backend.platformAppId

	const {remote, authMediator, setMockLatency} = await mockWiredRemote({
		appId,
		backend,
		storage,
		appOrigin,
	})

	const {stripePopups} = backend

	const chatConnect = await chatMockClientEntirely(storage)
	// const chatConnect = chatSocketClient("ws://localhost:8001/")

	return {appId, remote, storage, authMediator, backend, stripePopups, setMockLatency, chatConnect}
}
