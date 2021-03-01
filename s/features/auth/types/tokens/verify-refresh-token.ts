
import {RefreshToken} from "./refresh-token.js"
import {RefreshPayload} from "./refresh-payload.js"

export type VerifyRefreshToken = (
	refreshToken: RefreshToken
) => Promise<RefreshPayload>
