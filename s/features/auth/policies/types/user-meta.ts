
import {AnonMeta} from "./anon-meta.js"
import {AccessToken} from "../../types/tokens/access-token.js"

export interface UserMeta extends AnonMeta {
	accessToken: AccessToken
}
