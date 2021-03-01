import {AccessPayload} from "./AccessPayload.js"
import {AccessToken} from "./AccessToken.js"


export type VerifyAccessToken = (
	accessToken: AccessToken
) => Promise<AccessPayload>
