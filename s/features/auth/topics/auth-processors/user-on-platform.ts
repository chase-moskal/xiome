
import {prepareUserOnAnyApp} from "./user-on-any-app.js"
import {AppToken, AccessToken, Tables, AuthProcessorPreparations} from "./../../auth-types.js"

export function prepareUserOnPlatform<T extends Tables>(preparations: AuthProcessorPreparations<T>) {

	const userOnAnyApp = prepareUserOnAnyApp(preparations)

	return async(meta: {
				appToken: AppToken
				accessToken: AccessToken
			}) => {
		const auth = await userOnAnyApp(meta)
		if (!auth.app.platform) throw new Error("restricted platform-only topic")
		return auth
	}
}
