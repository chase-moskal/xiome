
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export type RoleHasPrivilegeRow = {
	roleId: DamnId
	privilegeId: DamnId
	immutable: boolean
	active: boolean
}
