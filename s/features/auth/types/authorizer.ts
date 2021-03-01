
import {User} from "./user.js"
import {AccessToken} from "./tokens/access-token.js"

export type Authorizer = (
	accessToken: AccessToken
) => Promise<User>
