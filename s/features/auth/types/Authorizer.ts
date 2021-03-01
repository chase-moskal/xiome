import {AccessToken} from "./AccessToken.js"
import {User} from "./User.js"


export type Authorizer = (
	accessToken: AccessToken
) => Promise<User>
