import {RefreshPayload} from "./RefreshPayload.js"
import {RefreshToken} from "./RefreshToken.js"


export type VerifyRefreshToken = (
	refreshToken: RefreshToken
) => Promise<RefreshPayload>
