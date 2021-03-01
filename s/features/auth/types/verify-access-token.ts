
import {AccessToken} from "./tokens/access-token.js"
import {AccessPayload} from "./tokens/access-payload.js"

export type VerifyAccessToken = (
	accessToken: AccessToken
) => Promise<AccessPayload>
