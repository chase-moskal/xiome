
import * as renraku from "renraku"

import {NotesSchema} from "./tables/notes-schema.js"
import {makeNotesService} from "./services/notes-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/unconstrained-table.js"

export function notesApi({config, notesTables, authPolicies}: {
		config: SecretConfig,
		notesTables: UnconstrainedTables<NotesSchema>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	}) {

	return renraku.api({
		notesService: makeNotesService({
			config,
			notesTables,
			basePolicy: authPolicies.userPolicy,
		})
	})
}
