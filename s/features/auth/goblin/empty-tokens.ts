
import {AuthTokens} from "../types/auth-token.js"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
