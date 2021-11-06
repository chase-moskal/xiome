
import {assert, expect} from "cynic"
import {makeNotesModel} from "../../models/notes-model.js"
import {Notes, Paging} from "../../types/notes-concepts.js"

function preparePageAssertions(notes: Notes.Any[], type: "new" | "old") {
	return {
		notes,
		assertNotesLength(n: number) {
			expect(notes).defined()
			assert(notes.length === n, `there should be ${n} ${type} notes`)
		},
		assertNoteTitle(index: number, title: string) {
			expect(notes).defined()
			const note = notes[index]
			expect(note).defined()
			assert(note.title === title, `the note title should be "${title}"`)
		},
	}
}

export function prepareNoteInboxAssertions({notesModel}: {
		notesModel: ReturnType<typeof makeNotesModel>
	}) {

	const cache = notesModel.createNotesCache()

	return {
		cache,
		async loadNewPage() {
			cache.switchTabNew()
			await cache.fetchAppropriateNotes()
			return preparePageAssertions(cache.notes, "new")
		},
		async loadOldPage() {
			cache.switchTabOld()
			await cache.fetchAppropriateNotes()
			return preparePageAssertions(cache.notes, "old")
		},
	}
}
