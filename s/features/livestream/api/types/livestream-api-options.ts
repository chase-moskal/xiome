
import {LivestreamTables} from "./livestream-tables.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

export interface LivestreamApiOptions {
	authPolicies: ReturnType<typeof prepareAuthPolicies>
	livestreamTables: UnconstrainedTables<LivestreamTables>
}
