
import {Rando} from "../../../../toolbox/get-rando.js"
import {QuestionsTables} from "../tables/types/questions-tables.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth2/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

export interface QuestionsApiOptions {
	rando: Rando
	config: SecretConfig
	authPolicies: ReturnType<typeof prepareAuthPolicies>
	questionsTables: UnconstrainedTables<QuestionsTables>
}
