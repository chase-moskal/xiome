
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {subbies} from "../../../toolbox/subbies.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {Notes, NotesStats, Pagination} from "../types/notes-concepts.js"

export function makeNotesModel({notesService}: {
		notesService: Service<typeof makeNotesService>
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		statsOp: ops.none() as Op<NotesStats>,
	})

	const refresh = subbies<undefined>()
	const propagateChangeToOtherTabs = subbies<undefined>()

	function getStats() {
		return ops.value(state.readable.statsOp) ?? {
			newCount: 0,
			oldCount: 0,
		}
	}

	async function loadStats() {
		return ops.operation({
			promise: notesService.getNotesStats(),
			setOp: op => state.writable.statsOp = op,
		})
	}

	async function loadNewNotes(pagination: Pagination): Promise<Notes.Any[]> {
		return notesService.getNewNotes(pagination)
	}

	async function loadOldNotes(pagination: Pagination): Promise<Notes.Any[]> {
		return notesService.getOldNotes(pagination)
	}

	async function markNotesNewOrOld(old: boolean, noteIds: string[]): Promise<void> {
		await notesService.markNotesNewOrOld({old, noteIds})
		await loadStats()
		refresh.publish(undefined)
		propagateChangeToOtherTabs.publish(undefined)
	}

	return {
		state: state.readable,
		stateSubscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			if (ops.isReady(op))
				await loadStats()
			refresh.publish(undefined)
		},

		get stats() {
			return getStats()
		},

		loadStats,
		refresh,
		propagateChangeToOtherTabs,
		overwriteStatsOp(op: Op<NotesStats>) {
			state.writable.statsOp = op
		},

		createNotesCache() {
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

			async function fetchAppropriateNotes() {
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
					refresh.publish(undefined)
					propagateChangeToOtherTabs.publish(undefined)
					await fetchAppropriateNotes()
				},

				async markSpecificNoteOld(noteId: string) {
					await markNotesNewOrOld(true, [noteId])
					await fetchAppropriateNotes()
				},

				async markSpecificNoteNew(noteId: string) {
					await markNotesNewOrOld(false, [noteId])
					await fetchAppropriateNotes()
				},

				get totalPages() {
					return totalNumberOfPages()
				},
			}
		},
	}
}
