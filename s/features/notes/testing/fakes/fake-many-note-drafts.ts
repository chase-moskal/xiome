
import {fakeNoteDraft} from "./fake-note-draft.js"
import {DraftForNote, Notes} from "../../types/notes-concepts.js"

export function fakeManyNoteDrafts(userId: string, n: number) {

	const noteDrafts: DraftForNote<Notes.Message>[] = []

	for (let i = 0; i < n; i++) {
		noteDrafts.push(fakeNoteDraft(userId, {
			title: `fake note number ${i}`,
		}))
	}

	return noteDrafts
}
