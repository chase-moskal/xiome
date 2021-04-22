
import {emptyTokens} from "./empty-tokens.js"
import {makeTokenStore2} from "./token-store2.js"
import {pubsub} from "../../../toolbox/pubsub.js"
import {onesie} from "../../../toolbox/onesie.js"
import {loginTopic} from "../topics/login-topic.js"
import {appTokenTopic} from "../topics/app-token-topic.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {decodeAppToken} from "../tools/tokens/decode-app-token.js"
import {decodeAccessToken} from "../tools/tokens/decode-access-token.js"

import {Service} from "../../../types/service.js"
import {AuthTokens} from "../types/tokens/auth-token.js"
import {AccessToken} from "../types/tokens/access-token.js"
import {RefreshToken} from "../types/tokens/refresh-token.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {AccessEventListener} from "./types/access-event-listener.js"

export function makeAuthGoblin({appId, tokenStore, authorize: originalAuthorize, authorizeApp: originalAuthorizeApp}: {
		appId: string
		tokenStore: ReturnType<typeof makeTokenStore2>
		authorize: Service<typeof loginTopic>["authorize"]
		authorizeApp: Service<typeof appTokenTopic>["authorizeApp"]
	}) {

	const authorize = onesie(originalAuthorize)
	const authorizeApp = onesie(originalAuthorizeApp)

	const accessEvent = pubsub<AccessEventListener>()

	async function saveTokensAndFireEvents(tokens: AuthTokens) {
		await tokenStore.saveAuthTokens(tokens)
		const access: AccessPayload = tokens.accessToken
			? decodeAccessToken(tokens.accessToken)
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

	const getAccessAndReauthorizeIfNecessary = async() => {
		const {accessToken, refreshToken} = await tokenStore.loadAuthTokens()
		let result: {access: AccessPayload; accessToken: AccessToken} = {
			accessToken,
			access: undefined,
		}
		if (isTokenValid(refreshToken)) {
			if (isTokenValid(accessToken)) {
				result.access = decodeAccessToken(accessToken)
			}
			else {
				result = await authorizeAndProcess(refreshToken)
			}
		}
		else {
			result.accessToken = undefined
		}
		return result
	}

	const getAppTokenAndReauthorizeIfNecessary = async() => {
		let appToken = await tokenStore.loadAppToken()

		if (!appToken || !isTokenValid(appToken)) {
			appToken = await authorizeApp({appId})
			await tokenStore.saveAppToken(appToken)
		}
		const result = appToken
			? {appToken, app: decodeAppToken(appToken)}
			: {appToken, app: undefined}
		return result
	}

	return {
		clearAuth: clearTokens,
		onAccessChange: accessEvent.subscribe,
		async forceAccessChange(access: AccessPayload) {
			await accessEvent.publish(access)
		},
		async refreshFromStorage() {
			const {access} = await getAccessAndReauthorizeIfNecessary()
			await accessEvent.publish(access)
		},
		async authenticate(tokens: AuthTokens) {
			return saveTokensAndFireEvents(tokens)
		},
		async reauthorize(): Promise<AccessPayload> {
			const {refreshToken} = await tokenStore.loadAuthTokens()
			if (!refreshToken) throw new Error("missing refresh token")
			return (await authorizeAndProcess(refreshToken)).access
		},
		async getAccess() {
			return (await getAccessAndReauthorizeIfNecessary()).access
		},
		async getAccessToken() {
			return (await getAccessAndReauthorizeIfNecessary()).accessToken
		},
		async getApp() {
			return (await getAppTokenAndReauthorizeIfNecessary()).app
		},
		async getAppToken() {
			return (await getAppTokenAndReauthorizeIfNecessary()).appToken
		},
	}
}
