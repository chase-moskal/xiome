
import {AccessToken} from "./access-token.js"
import {AccessPayload} from "./access-payload.js"

export type VerifyAccessToken = (
	accessToken: AccessToken
) => Promise<AccessPayload>
