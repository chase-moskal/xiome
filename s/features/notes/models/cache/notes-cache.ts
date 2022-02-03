
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {Subbie} from "../../../../toolbox/subbies.js"
import {makeNotesService} from "../../api/services/notes-service.js"
import {Notes, NotesStats, Pagination} from "../../types/notes-concepts.js"

export function prepareNotesCacheCreator({
		propagateChangeToOtherTabs,
		notesService,
		getStats,
		loadStats,
		getIsLoggedIn,
	}: {
		propagateChangeToOtherTabs: Subbie
		notesService: Service<typeof makeNotesService>
		getStats: () => NotesStats
		getIsLoggedIn: () => boolean
		loadStats: () => Promise<NotesStats>
	}) {

	async function loadNewNotes(pagination: Pagination): Promise<Notes.Any[]> {
		return notesService.getNewNotes(pagination)
	}

	async function loadOldNotes(pagination: Pagination): Promise<Notes.Any[]> {
		return notesService.getOldNotes(pagination)
	}

	async function markNotesNewOrOld(old: boolean, noteIds: string[]): Promise<void> {
		await notesService.markNotesNewOrOld({old, noteIds})
		await loadStats()
		propagateChangeToOtherTabs.publish(undefined)
	}

	return function createNotesCache() {
		const cacheState = snapstate({
			old: false,
			pageNumber: 1,
			pageSize: 10,
			notesOp: ops.none() as Op<Notes.Any[]>,
		})

		function resetPagination() {
			cacheState.writable.pageNumber = 1
			cacheState.writable.pageSize = 10
		}

		async function fetchAppropriateNotes(): Promise<Notes.Any[]> {
			if (!getIsLoggedIn()) {
				cacheState.writable.notesOp = ops.ready([])
				return []
			}

			const {old, pageNumber, pageSize} = cacheState.readable

			const pagination: Pagination = {
				offset: ((pageNumber - 1) * pageSize),
				limit: pageSize,
			}

			await ops.operation({
				setOp: op => cacheState.writable.notesOp = op,
				promise: old
					? loadOldNotes(pagination)
					: loadNewNotes(pagination),
			})
		}

		function totalNumberOfPages() {
			const {old, pageSize} = cacheState.readable
			const {oldCount, newCount} = getStats()
			const count = old
				? oldCount
				: newCount
			return Math.ceil(count / pageSize)
		}

		const isPageAvailable = {
			next: () => cacheState.writable.pageNumber < totalNumberOfPages(),
			previous: () => cacheState.writable.pageNumber > 1,
		}

		return {
			subscribe: cacheState.subscribe,
			cacheState: cacheState.readable,

			async loginStatusChanged() {
				resetPagination()
				await fetchAppropriateNotes()
			},

			get notes() {
				return ops.value(cacheState.readable.notesOp)
			},

			fetchAppropriateNotes,

			async switchTabNew() {
				cacheState.writable.old = false
				resetPagination()
				await fetchAppropriateNotes()
			},

			async switchTabOld() {
				cacheState.writable.old = true
				resetPagination()
				await fetchAppropriateNotes()
			},

			get isNextPageAvailable() {
				return isPageAvailable.next()
			},

			get isPreviousPageAvailable() {
				return isPageAvailable.previous()
			},

			async nextPage() {
				if (isPageAvailable.next()) {
					cacheState.writable.pageNumber += 1
					await fetchAppropriateNotes()
				}
				else throw new Error("no next page")
			},

			async previousPage() {
				if (isPageAvailable.previous()) {
					cacheState.writable.pageNumber -= 1
					await fetchAppropriateNotes()
				}
				else throw new Error("no previous page")
			},

			async markAllNotesOld() {
				await notesService.markAllNotesOld()
				await loadStats()
				propagateChangeToOtherTabs.publish(undefined)
				await fetchAppropriateNotes()
			},

			async markSpecificNoteOld(noteId: string) {
				await markNotesNewOrOld(true, [noteId])
				cacheState.readable.pageNumber > totalNumberOfPages() && cacheState.readable.pageNumber > 1
					? cacheState.writable.pageNumber -= 1
					: null
				await fetchAppropriateNotes()
			},

			async markSpecificNoteNew(noteId: string) {
				await markNotesNewOrOld(false, [noteId])
				cacheState.readable.pageNumber > totalNumberOfPages() && cacheState.readable.pageNumber > 1
					? cacheState.writable.pageNumber -= 1
					: null
				await fetchAppropriateNotes()
			},

			get totalPages() {
				return totalNumberOfPages()
			},
		}
	}
}
