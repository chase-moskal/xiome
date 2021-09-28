
import {AuthTables} from "../../../../auth/types/auth-tables.js"
import {PrivilegeDisplay} from "../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"
import {viewPrivilege} from "../../../testing/video-setup.js"

export async function getAllPrivileges({authTables}: {
		authTables: AuthTables
	}): Promise<PrivilegeDisplay[]> {
	
	return [
		{
			label: "view my videos",
			privilegeId: viewPrivilege,
			hard: false,
		},
	]
}
