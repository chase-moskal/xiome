
import {emptyTokens} from "./empty-tokens.js"
import {AuthTokens} from "../../../../features/auth/auth-types.js"
import {makeJsonStorage, SimpleStorage} from "../../../../toolbox/json-storage.js"

const tokenStoreKey = "tokenStore"

export function makeTokenStore2({storage}: {storage: SimpleStorage}) {
	const jsonStorage = makeJsonStorage(storage)
	return {
		async clearTokens() {
			jsonStorage.write(tokenStoreKey, emptyTokens())
		},
		async saveTokens(tokens: AuthTokens) {
			jsonStorage.write(tokenStoreKey, tokens)
		},
		async loadTokens() {
			return jsonStorage.read<AuthTokens>(tokenStoreKey)
				|| emptyTokens()
		},
	}
}
