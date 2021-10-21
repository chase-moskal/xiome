
import {Suite, assert} from "cynic"
import {ops} from "../../framework/ops.js"
import {fakeNoteDraft} from "./testing/fakes/fake-note-draft.js"
import {notesTestingSetup} from "./testing/notes-testing-setup.js"

export default <Suite>{

	async "new count increases"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend

		let stats = await notesModel.loadStats()

		function assertNewCount(count: number) {
			assert(stats.newCount === count, `new count should be at ${count}`)
			assert(
				stats.newCount === ops.value(notesModel.state.statsOp).newCount,
				`new count should be reflected in the model state`,
			)
		}

		assertNewCount(0)

		await notesDepositBox.sendNote(fakeNoteDraft(userId))
		stats = await notesModel.loadStats()
		assertNewCount(1)

		await notesDepositBox.sendNote(fakeNoteDraft(userId))
		stats = await notesModel.loadStats()
		assertNewCount(2)
	},

	async "message is readable"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		{
			await notesModel.loadNewNotes({offset: 0, limit: 10})
			const notesOp = notesModel.getNewNotes({offset: 0, limit: 10})
			const notes = ops.value(notesOp)
			assert(ops.isReady(notesOp), "new notes op becomes ready")
			assert(notes.length, "new notes length starts at zero")
		}
		await notesDepositBox.sendNote(fakeNoteDraft(userId))
		{
			await notesModel.loadNewNotes({offset: 0, limit: 10})
			const notesOp = notesModel.getNewNotes({offset: 0, limit: 10})
			const notes = ops.value(notesOp)
			assert(ops.isReady(notesOp), "new notes op becomes ready")
			assert(notes.length === 1, "new notes length updates to 1")
			assert(notes[0].to === userId, "note is to the user id")
			assert(notes[0].title.length > 0, "note title has content")
		}
	},
}
