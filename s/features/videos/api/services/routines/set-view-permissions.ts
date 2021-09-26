
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {VideoTables, ViewPrivilegeRow} from "../../../types/video-tables.js"

export async function setViewPermissions({
		label, privileges, videoTables,
	}: {
		label: string
		privileges: string[]
		videoTables: VideoTables
	}) {

	const oldPrivileges = await videoTables
		.viewPrivileges.read(find({label}))
		.then(rows => rows.map(row => row.privilegeId.toString()))

	// remove unwanted privileges

	const oldPrivilegeNotFoundInNewPrivileges = (oldPrivilege: string) =>
		!privileges.find(p => p === oldPrivilege)

	const unwantedPrivileges =
		oldPrivileges.filter(oldPrivilegeNotFoundInNewPrivileges)

	if (unwantedPrivileges.length)
		await videoTables.viewPrivileges.delete(
			findAll<string, ViewPrivilegeRow>(unwantedPrivileges, p => ({
				label,
				privilegeId: DamnId.fromString(p),
			}))
		)

	// add new privileges

	const newPrivilegeNotFoundInOldPrivileges = (privilege: string) =>
		!oldPrivileges.find(old => old === privilege)

	const newPrivileges =
		privileges.filter(newPrivilegeNotFoundInOldPrivileges)

	await videoTables.viewPrivileges.create(
		...newPrivileges.map(privilege => ({
			label,
			privilegeId: DamnId.fromString(privilege),
		}))
	)
}
