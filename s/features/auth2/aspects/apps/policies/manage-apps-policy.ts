
import {Policy} from "renraku/x/types/primitives/policy.js"

import {CommonAuthOptions} from "../../../types/auth-options.js"
import {AppsAuth, AppsMeta} from "../types/apps-meta-and-auth.js"

export function appsManagerPolicy(options: CommonAuthOptions): Policy<AppsMeta, AppsAuth> {
	return async(meta, request) => {
		const auth = await options.authPolicies.platformUser(meta, request)
		return {
			...auth,
			appTables: options.appTables,
		}
	}
}
