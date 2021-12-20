
import {renrakuApi} from "renraku"

import {NotesTables} from "./tables/notes-tables.js"
import {makeNotesService} from "./services/notes-service.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export function notesApi({config, notesTables, authPolicies}: {
		config: SecretConfig,
		notesTables: UnconstrainedTables<NotesTables>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	}) {

	return renrakuApi({
		notesService: makeNotesService({
			config,
			notesTables,
			basePolicy: authPolicies.userPolicy,
		})
	})
}
