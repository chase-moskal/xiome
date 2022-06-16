
import {Id} from "dbmage"

export interface PermissionsInteractions {

	grantUserRoles({}: {
		userId: Id
		timeframeEnd: number
		timeframeStart: number
		roleIds: Id[]
	}): Promise<void>

	revokeUserRoles({}: {
		userId: Id
		roleIds: Id[]
	}): Promise<void>
}
