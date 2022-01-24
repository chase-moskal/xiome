
import * as renraku from "renraku"

import {makeNotesService} from "./services/notes-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"

export function notesApi({config, authPolicies}: {
		config: SecretConfig,
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	}) {

	return renraku.api({
		notesService: makeNotesService({
			config,
			basePolicy: authPolicies.userPolicy,
		})
	})
}
