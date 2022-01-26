
import {findAll} from "../../../../../toolbox/dbproxy/dbproxy.js"
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

import {videoPrivileges} from "../../video-privileges.js"
import {VideoView} from "../../../types/video-concepts.js"
import {VideoSchema} from "../../../types/video-schema.js"
import {isPermittedToView} from "./is-permitted-to-view.js"
import {PrivilegeChecker} from "../../../../auth/aspects/permissions/types/privilege-checker.js"

export async function getVideoViews({
		labels, videoTables, checker, userPrivileges,
	}: {
		labels: string[]
		userPrivileges: string[]
		videoTables: dbproxy.SchemaToTables<VideoSchema>
		checker: PrivilegeChecker<typeof videoPrivileges>
	}): Promise<VideoView[]> {

	if (labels.length === 0)
		return []

	const dacastRows = await videoTables.viewDacast.read(
		findAll(labels, label => ({label}))
	)

	const privilegeRows = await videoTables.viewPrivileges.read(
		findAll(labels, label => ({label}))
	)

	return dacastRows.map(({label, type, dacastId}) => {
		const privileges = privilegeRows
			.filter(p => p.label === label)
			.map(p => p.privilegeId.toString())
		const hasExplicitPrivilege = isPermittedToView({
			viewPrivileges: privileges,
			userPrivileges,
		})
		const isPermitted = hasExplicitPrivilege
			|| checker.hasPrivilege("view all videos")
			|| checker.hasPrivilege("moderate videos")
		return isPermitted
			? {
				type,
				label,
				privileges,
				id: dacastId,
				provider: "dacast",
			}
			: undefined
	})
}
