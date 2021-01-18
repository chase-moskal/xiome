
import {AuthTokens} from "../../../../features/auth/auth-types.js"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
