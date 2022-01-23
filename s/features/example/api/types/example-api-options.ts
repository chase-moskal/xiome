
import {Rando} from "../../../../toolbox/get-rando.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {DatabaseSubsection, DatabaseTables} from "../../../../assembly/backend/types/database.js"

export interface ExampleApiOptions {
	rando: Rando
	config: SecretConfig
	database: DatabaseSubsection<DatabaseTables["example"]>
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
