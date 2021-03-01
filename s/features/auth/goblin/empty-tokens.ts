
import {AuthTokens} from "../types/tokens/auth-token.js"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
