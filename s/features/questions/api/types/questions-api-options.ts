
import {Rando} from "dbmage"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface QuestionsApiOptions {
	rando: Rando
	config: SecretConfig
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
