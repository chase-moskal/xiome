
import {BaseAnonMeta} from "./base-anon-meta.js"
import {AccessToken} from "../../../../types/auth-types.js"

export interface BaseUserMeta extends BaseAnonMeta {
	accessToken: AccessToken
}
