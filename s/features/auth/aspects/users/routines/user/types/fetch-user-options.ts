
import {AuthTables} from "../../../../../types/auth-tables.js"
import {DamnId} from "../../../../../../../toolbox/damnedb/damn-id.js"
import {PermissionsEngine} from "../../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export interface FetchUserOptions {
	userIds: DamnId[]
	authTables: AuthTables
	permissionsEngine: PermissionsEngine
}
