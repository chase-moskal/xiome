
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export interface AdministrativeApiOptions {
	config: PlatformConfig
	authTables: AuthTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
