
import {QuestionsTables} from "../tables/types/questions-tables.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"
import {Rando} from "../../../../toolbox/get-rando.js"

export interface QuestionsApiOptions {
	rando: Rando
	config: PlatformConfig
	questionsTables: QuestionsTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
