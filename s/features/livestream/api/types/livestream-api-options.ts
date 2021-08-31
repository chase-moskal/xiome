
import {LivestreamTables} from "./livestream-tables.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface LivestreamApiOptions {
	livestreamTables: LivestreamTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
