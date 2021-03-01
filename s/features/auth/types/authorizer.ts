
import {User} from "./user.js"
import {AccessToken} from "./access-token.js"

export type Authorizer = (
	accessToken: AccessToken
) => Promise<User>
