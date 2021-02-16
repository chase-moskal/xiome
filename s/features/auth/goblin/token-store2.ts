
import {emptyTokens} from "./empty-tokens.js"
import {AppToken, AuthTokens} from "../auth-types.js"
import {TokenStoreOptions} from "./types/token-store-options.js"

export function makeTokenStore2({
		appId,
		storage,
		publishAppTokenChange = () => {},
		publishAuthTokenChange = () => {},
	}: TokenStoreOptions) {

	const appKey = `tokenstore-app-${appId}`
	const authKey = `tokenstore-auth-${appId}`

	return {
		async saveAppToken(appToken: AppToken) {
			await storage.write(appKey, appToken)
			await publishAppTokenChange()
		},

		async loadAppToken(): Promise<AppToken> {
			return await storage.read<AppToken>(appKey) ?? undefined
		},

		async saveAuthTokens(tokens: AuthTokens) {
			await storage.write(authKey, tokens)
			await publishAuthTokenChange()
		},

		async loadAuthTokens(): Promise<AuthTokens> {
			return await storage.read<AuthTokens>(authKey)
				?? emptyTokens()
		},
	}
}
