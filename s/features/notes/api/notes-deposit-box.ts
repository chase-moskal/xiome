
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {DatabaseSafe} from "../../../assembly/backend/types/database.js"
import {Database, DraftForNote, Notes} from "../types/notes-concepts.js"

export function makeNotesDepositBox({rando, database}: {
		rando: Rando
		database: DatabaseSafe
	}) {

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

		await database.tables.notes.notes.create(...notes.map(n => n.noteBase))

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
