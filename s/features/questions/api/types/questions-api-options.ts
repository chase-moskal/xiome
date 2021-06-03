
import {QuestionsTables} from "../tables/types/questions-tables.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export interface QuestionsApiOptions {
	config: PlatformConfig
	questionsTables: QuestionsTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
