
import * as dbmage from "dbmage"

import {VideoView} from "../../../types/video-concepts.js"
import {VideoSchema} from "../../../types/video-schema.js"

export async function getAllViews({videoTables}: {
		videoTables: dbmage.SchemaToTables<VideoSchema>
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
			label: dacastRow.label,
			privileges,
			reference: {
				provider: "dacast" as const,
				type: dacastRow.type,
				id: dacastRow.dacastId,
			},
		}
	})
}
