
import {VideoView} from "../../../types/video-concepts.js"
import {VideoTables} from "../../../types/video-tables.js"

export async function getAllViews({videoTables}: {
		videoTables: VideoTables
	}): Promise<VideoView[]> {
	const viewDacastRows = await videoTables.viewDacast.read({
		conditions: false,
	})
	const viewPrivilegeRows = await videoTables.viewPrivileges.read({
		conditions: false,
	})
	return viewDacastRows.map(dacastRow => {
		const privileges = viewPrivilegeRows
			.filter(privilegeRow => privilegeRow.label === dacastRow.label)
			.map(r => r.privilegeId.toString())
		return {
			id: dacastRow.dacastId,
			label: dacastRow.label,
			privileges,
			provider: "dacast",
			type: dacastRow.type,
		}
	})
}
