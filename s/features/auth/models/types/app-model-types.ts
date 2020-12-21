
import {GetApi} from "../../../../types.js"
import {AuthModel} from "../auth-model.js"
import {AuthApi, DecodeAccessToken} from "../../auth-types.js"

export interface AppModelOptions {
	authModel: AuthModel
	getAuthApi: GetApi<AuthApi>
	decodeAccessToken: DecodeAccessToken
}
