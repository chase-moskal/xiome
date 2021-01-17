
import {AccessToken} from "../../../../features/auth/auth-types.js"

export interface AuthController {
	getAccessToken: () => Promise<AccessToken>
	setAccessToken: (token: AccessToken) => void
}
