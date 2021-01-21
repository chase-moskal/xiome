
import {mockApiOrigin} from "./mock-api-origin.js"
import {assembleFrontend} from "../assemble-frontend.js"
import {prepareMockRemote} from "../remote/mock-remote.js"

import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"

export function prepareMockBrowser({api}: {api: SystemApi}) {
	return async function mockBrowser() {
		const {fakeTokenIframe} = mockApiOrigin()

		async function mockAppWindow({
			apiLink,
			appToken,
			windowLink,
		}: {
			apiLink: string
			windowLink: string
			appToken: AppToken
		}) {
			const {tokenStore, onStorageEvent} = fakeTokenIframe()
			const {remote, authGoblin} = prepareMockRemote({
				api,
				apiLink,
				appToken,
				tokenStore,
			})
			onStorageEvent(authGoblin.refreshFromStorage)
			const frontend = await assembleFrontend({
				remote,
				authGoblin,
				link: windowLink,
			})
			return {frontend, remote}
		}

		return {mockAppWindow}
	}
}
