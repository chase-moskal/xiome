
import {mockRemote} from "./mock-remote.js"
import {mockApiOrigin} from "./mock-api-origin.js"
import {assembleModels} from "../../assemble-models.js"

import {SystemApi} from "../../types/backend/system-api.js"
import {AppToken} from "../../../features/auth/auth-types.js"

export async function mockBrowser({api}: {api: SystemApi}) {
	const {mockTokenIframe} = mockApiOrigin()

	async function mockAppWindow({
		apiLink,
		appToken,
		windowLink,
	}: {
		apiLink: string
		windowLink: string
		appToken: AppToken
	}) {
		const {tokenStore, onStorageEvent} = mockTokenIframe()
		const {remote, authGoblin} = mockRemote({
			api,
			apiLink,
			appToken,
			tokenStore,
		})
		onStorageEvent(authGoblin.refreshFromStorage)
		const frontend = await assembleModels({
			remote,
			authGoblin,
			link: windowLink,
		})
		return {frontend, remote}
	}

	return {mockAppWindow}
}
