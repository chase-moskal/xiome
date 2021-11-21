
import {assert} from "cynic"
import {ops} from "../../../../framework/ops.js"
import {makeNotesModel} from "../../models/notes-model.js"

export function prepareNoteStatsAssertions({notesModel}: {
		notesModel: ReturnType<typeof makeNotesModel>
	}) {

	return {
		assertNoteCounts({newCount, oldCount}: {
				newCount: number
				oldCount: number
			}) {

			const {statsOp} = notesModel.state
			assert(ops.isReady(statsOp))
		
			const stats = ops.value(statsOp)
			assert(stats.newCount === newCount, `new count should be at ${newCount}`)
			assert(stats.oldCount === oldCount, `old count should be at ${oldCount}`)
		},
	}
}
