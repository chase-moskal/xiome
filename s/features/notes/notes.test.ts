
import {Suite} from "cynic"

import {fakeNoteDraft} from "./testing/fakes/fake-note-draft.js"
import {notesTestingSetup} from "./testing/notes-testing-setup.js"
import {fakeManyNoteDrafts} from "./testing/fakes/fake-many-note-drafts.js"
import {prepareNoteStatsAssertions} from "./testing/assertions/note-stats-assertions.js"
import {prepareNoteInboxAssertions} from "./testing/assertions/notes-page-assertions.js"
import {ops} from "../../framework/ops.js"

export default <Suite>{

	async "new count increases"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		const {assertNoteCounts} = prepareNoteStatsAssertions({notesModel})

		await notesModel.loadStats()
		assertNoteCounts({newCount: 0, oldCount: 0})

		await notesDepositBox.sendNote(fakeNoteDraft(userId))
		await notesModel.loadStats()
		assertNoteCounts({newCount: 1, oldCount: 0})

		await notesDepositBox.sendNote(fakeNoteDraft(userId))
		await notesModel.loadStats()
		assertNoteCounts({newCount: 2, oldCount: 0})
	},

	async "a message for user is readable by user"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		const {loadNewPage} = prepareNoteInboxAssertions({notesModel})

		const draft = fakeNoteDraft(userId)
		await notesDepositBox.sendNote(draft)

		const pageTesting = await loadNewPage()
		pageTesting.assertNotesLength(1)
		pageTesting.assertNoteTitle(0, draft.title)
	},

	async "a message cannot be read by the wrong user"() {
		const {rando, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		const {loadNewPage} = prepareNoteInboxAssertions({notesModel})

		const draft = fakeNoteDraft(rando.randomId().toString())
		await notesDepositBox.sendNote(draft)

		const pageTesting = await loadNewPage()
		pageTesting.assertNotesLength(0)
	},

	async "user can mark a message old and then new again"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		const {cache, loadNewPage, loadOldPage} = prepareNoteInboxAssertions({notesModel})

		const draft = fakeNoteDraft(userId)
		await notesDepositBox.sendNote(draft)

		{
			const pageTesting = await loadNewPage()
			pageTesting.assertNotesLength(1)
			const {noteId} = pageTesting.notes[0]
			await cache.markSpecificNoteOld(noteId)
		}
		{
			const pageTesting = await loadNewPage()
			pageTesting.assertNotesLength(0)
		}
		{
			const pageTesting = await loadOldPage()
			pageTesting.assertNotesLength(1)
			const {noteId} = pageTesting.notes[0]
			await cache.markSpecificNoteNew(noteId)
		}
		{
			const newTesting = await loadNewPage()
			const oldTesting = await loadOldPage()
			oldTesting.assertNotesLength(0)
			newTesting.assertNotesLength(1)
		}
	},

	async "user can clear all new notes (making them all old)"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel} = frontend
		const {notesDepositBox} = backend
		const {assertNoteCounts} = prepareNoteStatsAssertions({notesModel})
		const {loadNewPage} = prepareNoteInboxAssertions({notesModel})

		const drafts = fakeManyNoteDrafts(userId, 100)
		await notesDepositBox.sendNotes(drafts)

		{
			await notesModel.loadStats()
			assertNoteCounts({newCount: 100, oldCount: 0})
			const pageTesting = await loadNewPage()
			pageTesting.assertNotesLength(10)
			const cache = await frontend.prepareCache()
			await cache.markAllNotesOld()
			assertNoteCounts({newCount: 0, oldCount: 100})
		}
	},

	async "refreshes between browser tabs"() {
		const {userId, backend, frontend, browserTab}
			= await notesTestingSetup()
		const {notesDepositBox} = backend
		const tab1 = frontend
		const tab2 = await browserTab()

		const tab1asserts = prepareNoteStatsAssertions({
			notesModel: tab1.notesModel
		})

		const tab2asserts = prepareNoteStatsAssertions({
			notesModel: tab2.notesModel
		})

		const draft = fakeNoteDraft(userId)
		const {noteId} = await notesDepositBox.sendNote(draft)

		await tab1.notesModel.loadStats()
		await tab2.notesModel.loadStats()

		tab1asserts.assertNoteCounts({newCount: 1, oldCount: 0})
		tab2asserts.assertNoteCounts({newCount: 1, oldCount: 0})

		const cache = await tab1.prepareCache()
		await cache.markSpecificNoteOld(noteId)
		tab1asserts.assertNoteCounts({newCount: 0, oldCount: 1})
		tab2asserts.assertNoteCounts({newCount: 0, oldCount: 1})
	},
}
