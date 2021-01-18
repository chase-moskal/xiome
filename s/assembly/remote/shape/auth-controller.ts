
import {Business} from "renraku/x/types/primitives/business.js"

import {pubsub} from "../../../toolbox/pubsub.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {isTokenValid} from "../../../features/auth/tools/is-token-valid.js"
import {makeJsonStorage, SimpleStorage} from "../../../toolbox/json-storage.js"
import {decodeAccessToken2} from "../../../features/auth/tools/decode-access-token2.js"
import {AccessPayload, AccessToken, AuthTokens, RefreshToken} from "../../../features/auth/auth-types.js"

const tokenStorageKey = "tokenStorage"

const getEmptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})

export function makeAuthController({storage, authorize}: {
		storage: SimpleStorage
		authorize: Business<ReturnType<typeof loginTopic>>["authorize"]
	}) {

	const store = makeJsonStorage(storage)

	const accessEvent = pubsub<
		(access: AccessPayload | undefined) => void | Promise<void>
	>()

	function saveTokens(tokens: AuthTokens) {
		store.write(tokenStorageKey, tokens)
	}

	function loadTokens() {
		let tokens: AuthTokens = getEmptyTokens()
		try {
			tokens = store.read(tokenStorageKey)
		} catch (e) {
			console.warn(`ignored corrupted "${tokenStorageKey}"`)
		}
		return tokens || getEmptyTokens()
	}

	async function processAccessToken(
			accessToken: AccessToken | undefined
		): Promise<AccessPayload | undefined> {
		let access: AccessPayload
		if (accessToken) {
			access = decodeAccessToken2(accessToken)
			await accessEvent.publish(access)
		}
		return access
	}

	async function clearAuth() {
		saveTokens(getEmptyTokens())
		await processAccessToken(undefined)
	}

	async function refreshAuth(
			refreshToken: RefreshToken
		): Promise<AccessPayload> {
		const accessToken = await authorize({
			refreshToken,
			scope: {core: true},
		})
		saveTokens({accessToken, refreshToken})
		return processAccessToken(accessToken)
	}

	return {
		clearAuth,

		subscribeToAccessChange: accessEvent.subscribe,

		async getAccess(): Promise<AccessPayload | undefined> {
			let access: AccessPayload
			const {accessToken, refreshToken} = loadTokens()
			if (isTokenValid(refreshToken)) {
				if (!isTokenValid(accessToken)) {
					access = await refreshAuth(refreshToken)
				}
			}
			else {
				await clearAuth()
			}
			return access
		},

		async reauthorize(): Promise<AccessPayload> {
			const {refreshToken} = loadTokens()
			if (!refreshToken) throw new Error("missing refresh token")
			return refreshAuth(refreshToken)
		},
	}
}
