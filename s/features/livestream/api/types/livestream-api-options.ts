
import {Rando} from "../../../../toolbox/get-rando.js"
import {LivestreamTables} from "./livestream-tables.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface LivestreamApiOptions {
	rando: Rando
	config: SecretConfig
	livestreamTables: LivestreamTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
