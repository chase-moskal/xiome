
import {AuthTokens} from "../types/auth-token"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
