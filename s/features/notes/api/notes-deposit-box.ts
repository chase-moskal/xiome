
import {Rando} from "../../../toolbox/get-rando.js"
import {NotesTables} from "./tables/notes-tables.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {Database, DraftForNote, Notes} from "../types/notes-concepts.js"

export function makeNotesDepositBox({rando, notesTables}: {
		rando: Rando
		notesTables: NotesTables
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
					to: DamnId.fromString(draft.to),
					from: draft.from === undefined
						? undefined
						: DamnId.fromString(draft.from),
					old: false,
					time: Date.now(),
				},
				noteDetails: draft.details,
			}
		})

		await notesTables.notes.create(...notes.map(n => n.noteBase))

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
