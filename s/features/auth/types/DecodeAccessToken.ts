import {AuthContext} from "./AuthContext.js"
import {AccessToken} from "./AccessToken.js"


export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext
