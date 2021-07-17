
import {CommonAuthOptions} from "../../../types/auth-options.js"
import {GreenMeta, GreenAuth} from "../../../types/auth-metas.js"
import {Policy} from "../../../../../../../renraku/x/types/primitives/policy.js"
import {namespaceTables} from "../../../../../framework/api/namespace-tables.js"

export function greenPolicy(options: CommonAuthOptions): Policy<GreenMeta, GreenAuth> {
	return async(meta, request) => ({
		authTablesForApp: appId => namespaceTables(appId, options.authTables)
	})
}
