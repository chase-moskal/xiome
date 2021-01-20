
import {emptyTokens} from "./empty-tokens.js"
import {AuthTokens} from "../../../../features/auth/auth-types.js"
import {makeJsonStorage, SimpleStorage} from "../../../../toolbox/json-storage.js"

function getStorageKey(appId: string) {
	return `tokenStore-${appId}`
}

export function makeTokenStore2({
		storage,
		publishMockStorageEvent = () => {},
	}: {
		storage: SimpleStorage
		publishMockStorageEvent?: () => void | Promise<void>
	}) {

	const jsonStorage = makeJsonStorage(storage)

	return {
		async saveTokens(appId: string, tokens: AuthTokens) {
			const key = getStorageKey(appId)
			jsonStorage.write(key, tokens)
			await publishMockStorageEvent()
		},

		async loadTokens(appId: string) {
			const key = getStorageKey(appId)
			return jsonStorage.read<AuthTokens>(key)
				|| emptyTokens()
		},
	}
}
