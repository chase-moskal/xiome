
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {isOriginValid} from "./validation/is-origin-valid.js"

import {App} from "../../types/tokens/app.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {BaseAnonAuth} from "./types/contexts/base-anon-auth.js"
import {BaseAnonMeta} from "./types/contexts/base-anon-meta.js"
import {BaseUserAuth} from "./types/contexts/base-user-auth.js"
import {BaseUserMeta} from "./types/contexts/base-user-meta.js"
import {BasePolicyOptions} from "./types/base-policy-options.js"

export function basePolicies({verifyToken}: BasePolicyOptions) {

	const baseAnon: Policy<BaseAnonMeta, BaseAnonAuth> = {
		processAuth: async(meta, request) => {
			const app = await verifyToken<App>(meta.appToken)
			if (!isOriginValid(request, app))
				throw new ApiError(403, "invalid origin")
			return {app}
		},
	}

	const baseUser: Policy<BaseUserMeta, BaseUserAuth> = {
		processAuth: async({accessToken, ...anonMeta}, request) => {
			const auth = await baseAnon.processAuth(anonMeta, request)
			const access = await verifyToken<AccessPayload>(accessToken)
			return {...auth, access}
		}
	}

	return {baseAnon, baseUser}
}
