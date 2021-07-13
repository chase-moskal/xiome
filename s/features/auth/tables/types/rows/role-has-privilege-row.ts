
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export type RoleHasPrivilegeRow = {
	roleId: DamnId
	id_privilege: string
	immutable: boolean
	active: boolean
}
