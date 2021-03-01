import {AccessPayload} from "./access-payload.js"
import {AccessToken} from "./access-token.js"


export type VerifyAccessToken = (
	accessToken: AccessToken
) => Promise<AccessPayload>
