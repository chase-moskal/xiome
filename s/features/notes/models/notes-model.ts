
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

	// TODO use window.postMessage to synchronize browser tabs
	// (when another tab sends a postMessage, publish the 'refresh' event)

	async function loadStats() {
		return ops.operation({
			promise: notesService.getNotesStats(),
			setOp: op => state.writable.statsOp = op,
		})
	}

	async function loadNewNotes({}: Pagination): Promise<Notes.Any[]> {
		// load new notes from the service
		return undefined
	}

	async function loadOldNotes({}: Pagination): Promise<Notes.Any[]> {
		// load old notes from the service
		return undefined
	}

	async function markNotesNew(noteIds: string[]): Promise<void> {
		// implement service call, and publish refresh
	}

	async function markNotesOld(noteIds: string[]): Promise<void> {
		// implement service call, and publish refresh
	}

	// communicate to each component that it should refresh
	// (re-fetch new count, and page of notes)
	const refresh = subbies<undefined>()

	return {
		state: state.readable,
		stateSubscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			if (ops.isReady(op))
				await loadStats()
			refresh.publish(undefined)
		},
		
		// load data from the backend
		loadStats,
		loadNewNotes,
		loadOldNotes,

		// actions that change data
		markNotesOld,
		markNotesNew,

		// allow components to subscribe to the refresh event
		refreshSubscribe: refresh.subscribe,
	}
}
