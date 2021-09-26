
import {videoPrivileges} from "../../video-privileges.js"
import {VideoView} from "../../../types/video-concepts.js"
import {VideoTables} from "../../../types/video-tables.js"
import {isPermittedToView} from "./is-permitted-to-view.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {PrivilegeChecker} from "../../../../auth/aspects/permissions/types/privilege-checker.js"

export async function getVideoView({
		label, videoTables, checker, userPrivileges,
	}: {
		label: string
		userPrivileges: string[]
		videoTables: VideoTables
		checker: PrivilegeChecker<typeof videoPrivileges>
	}): Promise<VideoView> {

	const dacastRow = await videoTables.viewDacast.one(find({label}))
	if (!dacastRow)
		return undefined

	const privileges = await videoTables
		.viewPrivileges.read(find({label}))
		.then(rows => rows.map(row => row.privilegeId.toString()))

	const hasExplicitPrivilege = isPermittedToView({
		viewPrivileges: privileges,
		userPrivileges,
	})
	if (!hasExplicitPrivilege && !checker.hasPrivilege("view all videos"))
		return undefined

	return {
		privileges,
		id: dacastRow.dacastId,
		label,
		provider: "dacast",
		type: dacastRow.type,
	}
}
