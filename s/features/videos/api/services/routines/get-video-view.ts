import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {PrivilegeChecker} from "../../../../auth/aspects/permissions/types/privilege-checker.js"
import {VideoView} from "../../../types/video-concepts.js"
import {VideoTables} from "../../../types/video-tables.js"
import {videoPrivileges} from "../../video-privileges.js"
import {getDacastApiKey} from "./get-dacast-api-key.js"
import {isPermittedToView} from "./is-permitted-to-view.js"

export async function getVideoView({
		label, apiKey, videoTables, checker, userPrivileges,
	}: {
		label: string
		apiKey: string
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
		throw new Error(`user does not have access to video view "${label}"`)

	return {
		privileges,
		id: dacastRow.dacastId,
		label,
		provider: "dacast",
		type: dacastRow.type,
	}
}
