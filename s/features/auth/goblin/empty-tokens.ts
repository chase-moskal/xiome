
import {AuthTokens} from "../types/auth-types.js"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
