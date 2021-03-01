
import {BaseAnonMeta} from "./base-anon-meta.js"
import {AccessToken} from "../../../../types/tokens/access-token.js"

export interface BaseUserMeta extends BaseAnonMeta {
	accessToken: AccessToken
}
