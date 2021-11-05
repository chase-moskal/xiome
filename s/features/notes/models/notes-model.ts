
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {subbies} from "../../../toolbox/subbies.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {Notes, NotesStats, Pagination} from "../types/notes-concepts.js"
import {boolean} from "../../../toolbox/darkvalley.js"

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
					cacheState.readable.old 
						? cacheState.writable.notesOp
						: cacheState.writable.notesOp
				},
				async previousPage() {
					cacheState.readable.old ? loadOldNotes : loadNewNotes
				},
				async markAllNotesOld() {},
				async markSpecificNoteOld(noteId: string) {},
				async markSpecificNoteNew(noteId: string) {},

				async totalNoOfPages() {
					//get total number of notes from statsOp and divide by pageSize(fixed?)
				}
			}
		},
	}
}



// notes should be rendered even before the next and previous buttons are clicked...
// 	- we should populate the notesOp array upon creation of a cache?
// 		(maybe with new notes -the notes components should be on new by default)

// so we probably still need new loadNewNotes and loadOldNotes functions in the cache, OR 
// could we call those functions(`loadNewNotes`,`loadOldNotes`,`markNotesNewOrOld`) 
// in the submodel and pass in arguments from what is in the cache's state?

// totalNo of pages = totalnumber of notes/page size
