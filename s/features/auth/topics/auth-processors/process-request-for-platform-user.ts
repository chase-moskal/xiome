
import {processRequestForUser} from "./process-request-for-user.js"
import {AppToken, AccessToken, Tables, AuthProcessorPreparations} from "../../auth-types.js"

export function processRequestForPlatformUser<T extends Tables>(preparations: AuthProcessorPreparations<T>) {

	const userOnAnyApp = processRequestForUser(preparations)

	return async(meta: {
				appToken: AppToken
				accessToken: AccessToken
			}) => {
		const auth = await userOnAnyApp(meta)
		if (!auth.app.platform) throw new Error("restricted platform-only topic")
		return auth
	}
}
