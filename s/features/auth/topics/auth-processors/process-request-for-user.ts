
import {processRequestForAnon} from "./process-request-for-anon.js"
import {AppToken, AccessToken, AccessPayload, AuthProcessorPreparations, Tables} from "../../auth-types.js"

export function processRequestForUser<T extends Tables>(preparations: AuthProcessorPreparations<T>) {
	return async({appToken, accessToken}: {
				appToken: AppToken
				accessToken: AccessToken
			}) => ({
		...await processRequestForAnon(preparations)({appToken}),
		access: await preparations.verifyToken<AccessPayload>(accessToken),
	})
}
