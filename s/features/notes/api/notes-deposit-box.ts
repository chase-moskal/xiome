
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {Database, DraftForNote, Notes} from "../types/notes-concepts.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {DatabaseSubsection, DatabaseTables} from "../../../assembly/backend/types/database.js"

export function makeNotesDepositBox({rando, appId, database: databaseRaw}: {
		rando: Rando
		appId: dbproxy.Id
		database: DatabaseSubsection<DatabaseTables["notes"]>
	}) {

	const tables = UnconstrainedTable.constrainTablesForApp({
		appId,
		unconstrainedTables: databaseRaw.tables,
	})

	async function sendNotes(
				drafts: DraftForNote<Notes.Any>[]
			): Promise<{noteId: string}[]> {

		const notes: {
			noteBase: Database.NoteBase
			noteDetails: Database.NoteDetails.Any
		}[] = drafts.map(draft => {
			const noteId = rando.randomId2()
			return {
				noteBase: {
					...draft,
					noteId,
					to: dbproxy.Id.fromString(draft.to),
					from: draft.from === undefined
						? undefined
						: dbproxy.Id.fromString(draft.from),
					old: false,
					time: Date.now(),
				},
				noteDetails: draft.details,
			}
		})

		await tables.notes.create(...notes.map(n => n.noteBase))

		return notes.map(({noteBase: {noteId}}) => ({
			noteId: noteId.toString()
		}))
	}

	async function sendNote(
				draft: DraftForNote<Notes.Any>
			): Promise<{noteId: string}> {
		const [sent] = await sendNotes([draft])
		return sent
	}

	return {
		sendNotes,
		sendNote,
	}
}
