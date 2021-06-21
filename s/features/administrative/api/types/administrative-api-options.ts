
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface AdministrativeApiOptions {
	config: SecretConfig
	authTables: AuthTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
