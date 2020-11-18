
import {prepareAnonOnAnyApp} from "./anon-on-any-app.js"
import {AppToken, AccessToken, AccessPayload, AuthProcessorPreparations, Tables} from "./../../auth-types.js"

export function prepareUserOnAnyApp<T extends Tables>(preparations: AuthProcessorPreparations<T>) {

	const anonOnAnyApp = prepareAnonOnAnyApp(preparations)

	return async({appToken, accessToken}: {
				appToken: AppToken
				accessToken: AccessToken
			}) => ({
		...await anonOnAnyApp({appToken}),
		access: await preparations.verifyToken<AccessPayload>(accessToken),
	})
}
