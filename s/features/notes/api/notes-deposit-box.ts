
import * as dbmage from "dbmage"

import {Rando} from "dbmage"
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
			const noteId = rando.randomId()
			return {
				noteBase: {
					...draft,
					noteId,
					to: dbmage.Id.fromString(draft.to),
					from: draft.from === undefined
						? undefined
						: dbmage.Id.fromString(draft.from),
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
