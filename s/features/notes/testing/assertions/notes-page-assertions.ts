
import {assert, expect} from "cynic"
import {makeNotesModel} from "../../models/notes-model.js"
import {Notes, Pagination, Paging} from "../../types/notes-concepts.js"

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

function paginate({pageSize, pageNumber}: Paging): Pagination {
	return {
		limit: pageSize,
		offset: pageSize * pageNumber,
	}
}

export function prepareNoteInboxAssertions({notesModel}: {
		notesModel: ReturnType<typeof makeNotesModel>
	}) {

	return {
		async loadNewPage(paging: Paging) {
			const newNotes = await notesModel.loadNewNotes(paginate(paging))
			return preparePageAssertions(newNotes, "new")
		},
		async loadOldPage(paging: Paging) {
			const oldNotes = await notesModel.loadOldNotes(paginate(paging))
			return preparePageAssertions(oldNotes, "old")
		},
	}
}
