
import {addMetaApi} from "renraku/dist/curries.js"

import {Api} from "../../types.js"
import {AccessToken, AppToken} from "../../features/auth/auth-types.js"

export function prepareApiAuthorizer<A extends Api>(api: A, appToken: AppToken) {
	return (accessToken: AccessToken) => addMetaApi(async() => ({appToken, accessToken}), api)
}
