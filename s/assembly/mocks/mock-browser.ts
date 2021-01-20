
import {mockApiOrigin} from "./mock-api-origin.js"
import {assembleFrontend} from "../assemble-frontend.js"
import {prepareMockRemote} from "../remote/mock-remote.js"

import {SystemApi} from "../types/backend/system-api.js"
import {AppToken} from "../../features/auth/auth-types.js"

export function prepareMockBrowser({api}: {api: SystemApi}) {
	return async function mockBrowser() {
		const {fakeTokenIframe} = mockApiOrigin()

		async function mockAppWindow({appToken}: {appToken: AppToken}) {
			const {tokenStore, onStorageEvent} = fakeTokenIframe()
			const {remote, authGoblin} = prepareMockRemote({
				api,
				appToken,
				tokenStore,
				apiLink: "http://localhost:5001/",
			})
			onStorageEvent(authGoblin.refreshFromStorage)
			const frontend = await assembleFrontend({
				remote,
				authGoblin,
				url: "http://localhost:5000/",
			})
			return {frontend, remote}
		}

		return {mockAppWindow}
	}
}
