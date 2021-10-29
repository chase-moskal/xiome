
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
	const synchronize = () => {
		const bc = new BroadcastChannel('publish refresh event')
		bc.postMessage(refresh.publish)
	}

	async function loadStats() {
		return ops.operation({
			promise: notesService.getNotesStats(),
			setOp: op => state.writable.statsOp = op,
		})
	}

	async function loadNewNotes(pagination: Pagination): Promise<Notes.Any[]> {
		// load new notes from the service
		return notesService.getNewNotes(pagination)
	}

	async function loadOldNotes(pagination: Pagination): Promise<Notes.Any[]> {
		// load old notes from the service
		return notesService.getOldNotes(pagination)
	}

	async function markNotesOldOrNew(old:boolean,noteIds: string[]): Promise<void> {
		// implement service call, and publish refresh
		notesService.markNotesNewOrOld({old, noteIds})
		refresh.publish
	}

	// async function markNotesOld(noteIds: string[]): Promise<void> {
	// 	// implement service call, and publish refresh
	// }

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
		markNotesOldOrNew,

		// allow components to subscribe to the refresh event
		refreshSubscribe: refresh.subscribe,
	}
}
