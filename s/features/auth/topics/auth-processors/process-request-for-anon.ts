
import {AppToken, AppPayload, AuthProcessorPreparations, Tables} from "../../auth-types.js"

export function processRequestForAnon<T extends Tables>({
			getTables,
			verifyToken,
		}: AuthProcessorPreparations<T>) {

	return async({appToken}: {appToken: AppToken}) => {
		if (!appToken) debugger
		const app = await verifyToken<AppPayload>(appToken)
		return {
			app,
			tables: <T>getTables({appId: app.appId}),
		}
	}
}
