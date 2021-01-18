
import {Business} from "renraku/x/types/primitives/business.js"

import {pubsub} from "../../../toolbox/pubsub.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"
import {isTokenValid} from "../../../features/auth/tools/is-token-valid.js"
import {AccessToken, AuthTokens} from "../../../features/auth/auth-types.js"
import {makeJsonStorage, SimpleStorage} from "../../../toolbox/json-storage.js"

const tokenStorageKey = "tokenStorage"

export function makeAuthController({storage, authorize}: {
		storage: SimpleStorage
		authorize: Business<ReturnType<typeof loginTopic>>["authorize"]
	}) {

	const store = makeJsonStorage(storage)
	const accessTokenEvent = pubsub<(accessToken: AccessToken) => void | Promise<void>>()

	async function saveTokens(tokens: AuthTokens) {
		store.write(tokenStorageKey, tokens)
		await accessTokenEvent.publish(tokens.accessToken)
	}

	async function loadTokens(): Promise<AuthTokens> {
		let tokens: AuthTokens = {accessToken: undefined, refreshToken: undefined}
		try {
			tokens = store.read(tokenStorageKey)
		} catch (e) {
			console.warn(`ignored corrupted "${tokenStorageKey}"`)
		}
		return tokens
	}

	return {
		subscribeToAccessTokenChange: accessTokenEvent.subscribe,

		async clearTokens() {
			const accessToken = undefined
			saveTokens({accessToken, refreshToken: undefined})
		},

		async getAccessToken() {
			const {accessToken, refreshToken} = await loadTokens()
			if (isTokenValid(refreshToken)) {
				if (!isTokenValid(accessToken)) {
					saveTokens({
						refreshToken,
						accessToken: await authorize({
							refreshToken,
							scope: {core: true},
						}),
					})
				}
			}
			else {
				saveTokens({refreshToken: undefined, accessToken: undefined})
			}
			return accessToken
		},
	}
}
