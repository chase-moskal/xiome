
import {BaseAnonMeta} from "./base-anon-meta.js"
import {AccessToken} from "../../../../auth-types.js"

export interface BaseUserMeta extends BaseAnonMeta {
	accessToken: AccessToken
}
