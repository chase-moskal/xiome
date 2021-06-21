
import {Rando} from "../../../../toolbox/get-rando.js"
import {QuestionsTables} from "../tables/types/questions-tables.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface QuestionsApiOptions {
	rando: Rando
	config: SecretConfig
	questionsTables: QuestionsTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
