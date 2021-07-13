
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export type UserHasRoleRow = {
	userId: DamnId
	roleId: DamnId
	timeframeStart: undefined | number
	timeframeEnd: undefined | number
	public: boolean
	hard: boolean
}
