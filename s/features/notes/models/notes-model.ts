
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {subbies} from "../../../toolbox/subbies.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {Notes, NotesStats, Pagination} from "../types/notes-concepts.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"

export function makeNotesModel({notesService}: {
		notesService: Service<typeof makeNotesService>
	}) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		statsOp: ops.none() as Op<NotesStats>,
	})

	const refresh = subbies<undefined>()
	const propagateChangeToOtherTabs = subbies<undefined>()

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

		loadStats,
		refresh,
		propagateChangeToOtherTabs,
		overwriteStatsOp(op: Op<NotesStats>) {
			state.writable.statsOp = op
		},

		// TODO these should note be exposed,
		// we must refactor the tests to use caches
		loadNewNotes,
		loadOldNotes,
		markNotesNewOrOld,

		// each notes component will have its own local cache
		// of which notes have been loaded to display
		// (so that different notes components can display different pages)
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
				const {statsOp} = state.readable
				const {old, pageSize} = cacheState.readable
				const {oldCount, newCount} = ops.value(statsOp)
				const totalNotesOnPage = old ? oldCount : newCount
				return Math.ceil(totalNotesOnPage/pageSize)
			}

			return {
				subscribe: cacheState.subscribe,
				cacheState: cacheState.readable,

				refresh: fetchAppropriateNotes,

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

				async nextPage() {
					if (cacheState.writable.pageNumber < totalNumberOfPages()) {
						cacheState.writable.pageNumber += 1
						await fetchAppropriateNotes()
					}
				},

				async previousPage() {
					if (cacheState.writable.pageNumber > 0) {
						cacheState.writable.pageNumber -= 1
						await fetchAppropriateNotes()
					}
				},

				async markAllNotesOld() {
					const {notesOp} = cacheState.readable
					const notesIds = ops.value(notesOp).map(notes => notes.noteId)
					await markNotesNewOrOld(true, notesIds)
				},

				async markSpecificNoteOld(noteId: string) {
					await markNotesNewOrOld(true, [noteId])
				},

				async markSpecificNoteNew(noteId: string) {
					await markNotesNewOrOld(false, [noteId])
				},

				totalNumberOfPages,
			}
		},
	}
}
