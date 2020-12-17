
import {processRequestForUser} from "./process-request-for-user.js"
import {AppToken, AccessToken, Tables, AuthProcessorPreparations} from "../../auth-types.js"

export function processRequestForPlatformUser<T extends Tables>(preparations: AuthProcessorPreparations<T>) {
	return async(meta: {
				appToken: AppToken
				accessToken: AccessToken
			}) => {
		const payload = await processRequestForUser(preparations)(meta)
		if (!payload.app.platform) throw new Error("restricted platform-only topic")
		return payload
	}
}
