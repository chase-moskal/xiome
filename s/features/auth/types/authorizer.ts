import {AccessToken} from "./access-token.js"
import {User} from "./user.js"


export type Authorizer = (
	accessToken: AccessToken
) => Promise<User>
