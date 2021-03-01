
import {AuthContext} from "./auth-context.js"
import {AccessToken} from "./access-token.js"

export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext
