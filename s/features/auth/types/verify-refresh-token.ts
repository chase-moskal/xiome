import {RefreshPayload} from "./refresh-payload.js"
import {RefreshToken} from "./refresh-token.js"


export type VerifyRefreshToken = (
	refreshToken: RefreshToken
) => Promise<RefreshPayload>
