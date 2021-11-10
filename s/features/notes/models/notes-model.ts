
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {subbies} from "../../../toolbox/subbies.js"
import {NotesStats} from "../types/notes-concepts.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {prepareNotesCacheCreator} from "./cache/notes-cache.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {makeNotesService} from "../api/services/notes-service.js"

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

		refresh,
		propagateChangeToOtherTabs,
		loadStats,
		overwriteStatsOp(op: Op<NotesStats>) {
			state.writable.statsOp = op
		},

		createNotesCache: prepareNotesCacheCreator({
			refresh,
			notesService,
			propagateChangeToOtherTabs,
			getStats,
			loadStats,
		}),
	}
}
