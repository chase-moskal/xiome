
import {RefreshToken} from "./tokens/refresh-token.js"
import {RefreshPayload} from "./tokens/refresh-payload.js"

export type VerifyRefreshToken = (
	refreshToken: RefreshToken
) => Promise<RefreshPayload>
