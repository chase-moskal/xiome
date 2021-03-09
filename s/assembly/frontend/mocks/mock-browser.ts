
import {mockRemote} from "./mock-remote.js"
import {mockApiOrigin} from "./mock-api-origin.js"
import {assembleModels} from "../assemble-models.js"
import {SystemApi} from "../../backend/types/system-api.js"
import {mockModalSystem} from "../modal/mock-modal-system.js"
import {mockPopups} from "../connect/mock/common/mock-popups.js"
import {MockLatency} from "../../../framework/add-mock-latency.js"
import {MockStripeOperations} from "../../../features/pay/stripe/mocks/types/mock-stripe-operations.js"
import {loginWithLinkTokenOrUseExistingLogin} from "../auth/login-with-link-token-or-use-existing-login.js"


export async function mockBrowser({api, mockStripeOperations}: {
			api: SystemApi
			mockStripeOperations: MockStripeOperations
		}) {
	const {mockTokenIframe} = mockApiOrigin()

	async function mockAppWindow({
			appId,
			apiLink,
			latency,
			windowLink,
		}: {
			appId: string
			apiLink: string
			windowLink: string
			latency: MockLatency
		}) {

		const {tokenStore, onStorageEvent} = mockTokenIframe(appId)
		const {remote, authGoblin} = mockRemote({
			api,
			appId,
			apiLink,
			latency,
			tokenStore,
			origin: new URL(windowLink).origin,
		})
		onStorageEvent(authGoblin.refreshFromStorage)

		const {modals, nextModalResults} = mockModalSystem()
		const models = await assembleModels({
			modals,
			remote,
			authGoblin,
			popups: mockPopups({mockStripeOperations}),
		})

		await loginWithLinkTokenOrUseExistingLogin({
			link: windowLink,
			authModel: models.authModel,
		})

		return {models, remote, nextModalResults}
	}

	return {mockAppWindow}
}
