
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
		newNoteOps: [] as Op<Notes.Any>[],
		oldNoteOps: [] as Op<Notes.Any>[],
	})

	async function loadStats() {
		return ops.operation({
			promise: notesService.getNotesStats(),
			setOp: op => state.writable.statsOp = op,
		})
	}

	async function loadNewNotes({}: Pagination) {
		// - fetch page of new notes, in an operation
		// - cache all notes by saving them in state.writable.notes
		// - overwrite page of new note ids in state.writable.newPages
	}

	async function loadOldNotes({}: Pagination) {
		// - fetch page of old notes, in an operation
		// - cache all notes by saving them in state.writable.notes
		// - overwrite page of old note ids state.writable.oldPages
	}

	// communicate to each component that it should refresh
	// (re-fetch new count, and page of notes)
	const refresh = subbies<undefined>()

	function getNewNotes({}: Pagination): Op<Notes.Any[]> {
		// return op array of notes,
		// by referencing newPages against notes
		return
	}

	function getOldNotes({}: Pagination): Op<Notes.Any[]> {
		// return op array of notes,
		// by referencing oldPages against notes
		return
	}

	return {
		state: state.readable,
		stateSubscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			refresh.publish(undefined)
		},
		
		// load data from the backend
		loadStats,
		loadNewNotes,
		loadOldNotes,

		// allow components to subscribe to the refresh event
		refreshSubscribe: refresh.subscribe,

		// fast functions to obtain cached pages of notes
		getNewNotes,
		getOldNotes,
	}
}
