
import {AuthTokens} from "../types/AuthTokens"

export const emptyTokens = (): AuthTokens => ({
	accessToken: undefined,
	refreshToken: undefined,
})
