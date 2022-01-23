
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"
import {Id, find} from "../../../../../toolbox/dbproxy/dbproxy.js"

import {VideoSchema} from "../../../types/video-schema.js"
import {PermissionsEngine} from "../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function setViewPermissions({
		label,
		engine,
		videoTables,
		privileges: privilegesInput,
	}: {
		label: string
		privileges: string[]
		videoTables: dbproxy.SchemaToTables<VideoSchema>
		engine: PermissionsEngine
	}) {

	// delete all privileges associated with this view
	await videoTables.viewPrivileges.delete(find({label}))

	// select only privileges that actually exist
	const privileges = await engine.getPrivileges(privilegesInput)
		.then(displays => displays
			.filter(d => !!d)
			.map(d => d.privilegeId.toString())
		)

	// add new privileges for this view
	await videoTables.viewPrivileges.create(
		...privileges.map(privilege => ({
			label,
			privilegeId: Id.fromString(privilege),
		}))
	)
}
