
import {emptyTokens} from "./empty-tokens.js"
import {AuthTokens} from "../auth-types.js"
import {makeJsonStorage} from "../../../toolbox/json-storage.js"
import {TokenStoreOptions} from "./types/token-store-options.js"

export function makeTokenStore2({
		storage,
		publishTokenChange = () => {}
	}: TokenStoreOptions) {

	const jsonStorage = makeJsonStorage(storage)
	const getStorageKey = (appId: string) => `tokenStore-${appId}`
	return {

		async saveTokens(appId: string, tokens: AuthTokens) {
			const key = getStorageKey(appId)
			jsonStorage.write(key, tokens)
			await publishTokenChange()
		},

		async loadTokens(appId: string) {
			const key = getStorageKey(appId)
			const result = jsonStorage.read<AuthTokens>(key)
				|| emptyTokens()
			return result
		},
	}
}
