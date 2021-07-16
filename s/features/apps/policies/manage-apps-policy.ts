
import {Policy} from "renraku/x/types/primitives/policy.js"

import {AppsApiOptions} from "../types/apps-api-options.js"
import {AppsAuth, AppsMeta} from "../types/apps-meta-and-auth.js"

export function manageAppsPolicy(options: AppsApiOptions): Policy<AppsMeta, AppsAuth> {
	return async(meta, request) => {
		const auth = await options.authPolicies.platformUser(meta, request)
		return {
			...auth,
			appTables: options.appTables,
		}
	}
}
