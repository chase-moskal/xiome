
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {subbies} from "../../../toolbox/subbies.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
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
				pageNumber: 0,
				pageSize: 10,
				newNotesOp: ops.none() as Op<Notes.Any[]>,
				oldNotesOp: ops.none() as Op<Notes.Any[]>,
			})
			return {
				subscribe: cacheState.subscribe,
				cacheState: cacheState.readable,

				async loadNewNotes() {},
				async loadOldNotes() {},
				async markNotesNewOrOld() {},
			}
		},
	}
}
