
import {BaseAnonMeta} from "./base-anon-meta.js"
import {AccessToken} from "../../../../types/access-token.js"

export interface BaseUserMeta extends BaseAnonMeta {
	accessToken: AccessToken
}
