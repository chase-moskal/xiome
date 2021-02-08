
import {emptyTokens} from "./empty-tokens.js"
import {AppToken, AuthTokens} from "../auth-types.js"
import {makeJsonStorage} from "../../../toolbox/json-storage.js"
import {TokenStoreOptions} from "./types/token-store-options.js"

export function makeTokenStore2({
		appId,
		storage,
		publishAppTokenChange = () => {},
		publishAuthTokenChange = () => {},
	}: TokenStoreOptions) {

	const jsonStorage = makeJsonStorage(storage)
	const appKey = `tokenstore-app-${appId}`
	const authKey = `tokenstore-auth-${appId}`

	return {
		async saveAppToken(appToken: AppToken) {
			jsonStorage.write(appKey, appToken)
			await publishAppTokenChange()
		},

		async loadAppToken(): Promise<AppToken> {
			return jsonStorage.read<AppToken>(appKey) ?? undefined
		},

		async saveAuthTokens(tokens: AuthTokens) {
			jsonStorage.write(authKey, tokens)
			await publishAuthTokenChange()
		},

		async loadAuthTokens(): Promise<AuthTokens> {
			return jsonStorage.read<AuthTokens>(authKey)
				?? emptyTokens()
		},
	}
}
