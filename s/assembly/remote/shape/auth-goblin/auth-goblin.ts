
import {emptyTokens} from "./empty-tokens.js"
import {makeTokenStore2} from "./token-store2.js"
import {pubsub} from "../../../../toolbox/pubsub.js"
import {onesie} from "../../../../toolbox/onesie.js"
import {loginTopic} from "../../../../features/auth/topics/login-topic.js"
import {isTokenValid} from "../../../../features/auth/tools/is-token-valid.js"
import {decodeAccessToken2} from "../../../../features/auth/tools/decode-access-token2.js"

import {Service} from "../../../../types/service.js"
import {AccessEventListener} from "../../../types/frontend/auth-goblin/access-event-listener.js"
import {AccessPayload, AccessToken, AuthTokens, RefreshToken} from "../../../../features/auth/auth-types.js"

export function makeAuthGoblin({appId, tokenStore, authorize}: {
		appId: string
		tokenStore: ReturnType<typeof makeTokenStore2>
		authorize: Service<typeof loginTopic>["authorize"]
	}) {

	const accessEvent = pubsub<AccessEventListener>()

	async function saveTokensAndFireEvents(tokens: AuthTokens) {
		await tokenStore.saveTokens(appId, tokens)
		const access: AccessPayload = tokens.accessToken
			? decodeAccessToken2(tokens.accessToken)
			: undefined
		await accessEvent.publish(access)
		return access
	}

	async function clearTokens() {
		await saveTokensAndFireEvents(emptyTokens())
	}

	async function authorizeAndProcess(refreshToken: RefreshToken) {
		const accessToken = await authorize({
			refreshToken,
			scope: {core: true},
		})
		const authTokens = {accessToken, refreshToken}
		const access = await saveTokensAndFireEvents(authTokens)
		return {access, accessToken}
	}

	const getAccessAndReauthorizeIfNecessary = onesie(async() => {
		const {accessToken, refreshToken} = await tokenStore.loadTokens(appId)
		let result: {access: AccessPayload; accessToken: AccessToken} = {
			accessToken,
			access: undefined,
		}
		if (isTokenValid(refreshToken)) {
			if (!isTokenValid(accessToken)) {
				result = await authorizeAndProcess(refreshToken)
			}
		}
		else {
			await clearTokens()
			result.accessToken = undefined
		}
		return result
	})

	return {
		clearAuth: clearTokens,
		onAccess: accessEvent.subscribe,
		async refreshFromStorage() {
			const {access} = await getAccessAndReauthorizeIfNecessary()
			await accessEvent.publish(access)
		},
		async authenticate(tokens: AuthTokens) {
			await saveTokensAndFireEvents(tokens)
		},
		async reauthorize(): Promise<AccessPayload> {
			const {refreshToken} = await tokenStore.loadTokens(appId)
			if (!refreshToken) throw new Error("missing refresh token")
			return (await authorizeAndProcess(refreshToken)).access
		},
		async getAccess() {
			return (await getAccessAndReauthorizeIfNecessary()).access
		},
		async getAccessToken() {
			return (await getAccessAndReauthorizeIfNecessary()).accessToken
		},
	}
}
