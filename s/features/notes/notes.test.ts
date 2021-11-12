
import {expect, Suite} from "cynic"

import {ops} from "../../framework/ops.js"
import {fakeNoteDraft} from "./testing/fakes/fake-note-draft.js"
import {notesTestingSetup} from "./testing/notes-testing-setup.js"
import {fakeManyNoteDrafts} from "./testing/fakes/fake-many-note-drafts.js"
import {prepareNoteStatsAssertions} from "./testing/assertions/note-stats-assertions.js"

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
		const {makeCacheAlreadySetup} = frontend
		const {notesDepositBox} = backend
		const cache = makeCacheAlreadySetup()

		const draft = fakeNoteDraft(userId)
		await notesDepositBox.sendNote(draft)

		await cache.fetchAppropriateNotes()
		expect(cache.notes.length).equals(1)
		expect(cache.notes[0].title).equals(draft.title)
	},

	async "a message cannot be read by the wrong user"() {
		const {rando, backend, frontend} = await notesTestingSetup()
		const {makeCacheAlreadySetup} = frontend
		const {notesDepositBox} = backend
		const cache = makeCacheAlreadySetup()

		const draft = fakeNoteDraft(rando.randomId().toString())
		await notesDepositBox.sendNote(draft)

		await cache.fetchAppropriateNotes()
		expect(cache.notes.length).equals(0)
	},

	async "user can mark a message old and then new again"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel, makeCacheAlreadySetup} = frontend
		const {notesDepositBox} = backend
		const cache = makeCacheAlreadySetup()
		const {assertNoteCounts} = prepareNoteStatsAssertions({notesModel})

		const draft = fakeNoteDraft(userId)
		await notesDepositBox.sendNote(draft)
		await notesModel.loadStats()
		await cache.fetchAppropriateNotes()

		{
			expect(cache.notes.length).equals(1)
			assertNoteCounts({newCount: 1, oldCount: 0})
			const {noteId} = cache.notes[0]
			await cache.markSpecificNoteOld(noteId)
			expect(cache.notes.length).equals(0)
		}
		{
			await cache.switchTabOld()
			expect(cache.notes.length).equals(1)
			const {noteId} = cache.notes[0]
			await cache.markSpecificNoteNew(noteId)
			expect(cache.notes.length).equals(0)
		}
		{
			await cache.switchTabNew()
			expect(cache.notes.length).equals(1)
		}
	},

	async "user can clear all new notes (making them all old)"() {
		const {userId, backend, frontend} = await notesTestingSetup()
		const {notesModel, makeCacheAlreadySetup} = frontend
		const {notesDepositBox} = backend
		const {assertNoteCounts} = prepareNoteStatsAssertions({notesModel})
		const cache = makeCacheAlreadySetup()

		const drafts = fakeManyNoteDrafts(userId, 100)
		await notesDepositBox.sendNotes(drafts)

		await notesModel.loadStats()
		await cache.fetchAppropriateNotes()

		assertNoteCounts({newCount: 100, oldCount: 0})
		expect(cache.notes.length).equals(10)

		await cache.markAllNotesOld()
		assertNoteCounts({newCount: 0, oldCount: 100})
		expect(cache.notes.length).equals(0)

		await cache.switchTabOld()
		expect(cache.notes.length).equals(10)
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

		const cache = tab1.notesModel.createNotesCacheDetails().cache
		await cache.markSpecificNoteOld(noteId)
		tab1asserts.assertNoteCounts({newCount: 0, oldCount: 1})
		tab2asserts.assertNoteCounts({newCount: 0, oldCount: 1})
	},

	"pagination": {
		async "user can flip through pages of new notes"() {
			const {userId, backend, frontend} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const drafts = fakeManyNoteDrafts(userId, 15)
			await notesDepositBox.sendNotes(drafts)

			await notesModel.loadStats()
			await cache.fetchAppropriateNotes()
			expect(cache.totalPages).equals(2)
			expect(cache.isNextPageAvailable).equals(true)
			expect(cache.isPreviousPageAvailable).equals(false)
			expect(cache.cacheState.pageNumber).equals(1)
			expect(cache.notes.length).equals(10)

			await cache.nextPage()
			expect(cache.isNextPageAvailable).equals(false)
			expect(cache.isPreviousPageAvailable).equals(true)
			expect(cache.cacheState.pageNumber).equals(2)
			expect(cache.notes.length).equals(5)
		},
		async "user can switch to 'old' tab"() {
			const {userId, backend, frontend} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const drafts = fakeManyNoteDrafts(userId, 21)
			await notesDepositBox.sendNotes(drafts)

			await notesModel.loadStats()
			await cache.fetchAppropriateNotes()
			expect(cache.totalPages).equals(3)
			expect(cache.isNextPageAvailable).equals(true)
			expect(cache.isPreviousPageAvailable).equals(false)
			expect(cache.cacheState.pageNumber).equals(1)
			expect(cache.notes.length).equals(10)

			const [{noteId}] = cache.notes

			await cache.switchTabOld()
			expect(cache.totalPages).equals(0)
			await cache.markSpecificNoteOld(noteId)
			expect(cache.totalPages).equals(1)
			expect(cache.notes.length).equals(1)

			await cache.switchTabNew()
			expect(cache.totalPages).equals(2)
		},
		async "invalid page flips throws errors"() {
			const {userId, backend, frontend} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const drafts = fakeManyNoteDrafts(userId, 5)
			await notesDepositBox.sendNotes(drafts)

			await notesModel.loadStats()
			await cache.fetchAppropriateNotes()
			expect(cache.totalPages).equals(1)
			expect(cache.isNextPageAvailable).equals(false)
			expect(cache.isPreviousPageAvailable).equals(false)

			await expect(cache.nextPage).throws()
			await expect(cache.previousPage).throws()
		},
		async "marking last note takes you to previous page"() {
			const {userId, backend, frontend} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const drafts = fakeManyNoteDrafts(userId, 11)
			await notesDepositBox.sendNotes(drafts)

			await notesModel.loadStats()
			await cache.fetchAppropriateNotes()
			expect(cache.notes.length).equals(10)
			expect(cache.totalPages).equals(2)
			expect(cache.cacheState.pageNumber).equals(1)
			
			await cache.nextPage()
			expect(cache.cacheState.pageNumber).equals(2)
			expect(cache.notes.length).equals(1)

			await cache.markSpecificNoteOld(cache.notes[0].noteId)
			expect(cache.cacheState.pageNumber).equals(1)
		},
		async "marking last note, but with many pages"() {
			const {userId, backend, frontend} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const drafts = fakeManyNoteDrafts(userId, 101)
			await notesDepositBox.sendNotes(drafts)

			await notesModel.loadStats()
			await cache.fetchAppropriateNotes()
			expect(cache.notes.length).equals(10)
			expect(cache.totalPages).equals(11)
			expect(cache.cacheState.pageNumber).equals(1)

			while (cache.cacheState.pageNumber < 11) {
				await cache.nextPage()
			}

			expect(cache.cacheState.pageNumber).equals(11)
			expect(cache.notes.length).equals(1)

			await cache.markSpecificNoteOld(cache.notes[0].noteId)
			expect(cache.cacheState.pageNumber).equals(10)
		},
	},

	"login changes": {
		async "logging out empties the notes array"() {
			const {userId, backend, frontend, access} = await notesTestingSetup()
			const {notesModel, makeCacheAlreadySetup} = frontend
			const {notesDepositBox} = backend
			const cache = makeCacheAlreadySetup()

			const draft = fakeNoteDraft(userId)
			await notesDepositBox.sendNote(draft)

			await cache.fetchAppropriateNotes()
			expect(cache.notes.length).equals(1)
			expect(cache.notes[0].title).equals(draft.title)

			await notesModel.updateAccessOp(ops.ready({
				...access,
				user: undefined,
			}))

			expect(notesModel.isLoggedIn).equals(false)
			expect(cache.notes.length).equals(0)
		},
	},
}
