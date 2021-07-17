
import {AuthTables} from "./auth-tables.js"
import {AppTables} from "../../auth/tables/types/table-groups/app-tables.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"

export interface AuthApiOptions {
	authPolicies: ReturnType<typeof prepareAuthPolicies>
	appTables: AppTables
	authTables: AuthTables
}
