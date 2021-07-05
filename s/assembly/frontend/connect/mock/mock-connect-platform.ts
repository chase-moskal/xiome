
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockConfig} from "../../../backend/mock-config.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {configureApiForBrowser} from "../../../backend/configure-api-for-browser.js"

export async function mockConnectPlatform({
		platformHome, storage,
	}: {
		platformHome: string
		storage: FlexStorage
	}) {

	const backend = await configureApiForBrowser(mockConfig({
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
		latency: {min: 200, max: 800},
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {appId, remote, authMediator, backend, popups}
}
