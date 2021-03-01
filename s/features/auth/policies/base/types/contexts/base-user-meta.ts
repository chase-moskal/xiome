
import {BaseAnonMeta} from "./base-anon-meta.js"
import {AccessToken} from "../../../../types/AccessToken"

export interface BaseUserMeta extends BaseAnonMeta {
	accessToken: AccessToken
}
