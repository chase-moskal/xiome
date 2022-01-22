
import {ExampleTables} from "./example-tables.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../framework/api/unconstrained-table.js"

export interface ExampleApiOptions {
	rando: Rando
	config: SecretConfig
	exampleTables: UnconstrainedTables<ExampleTables>
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
