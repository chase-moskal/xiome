
import {UserState2} from "../types/user-state.js"
import {Op, ops} from "../../../../../framework/ops.js"
import {UserResult} from "../../../api/types/user-result.js"

export function makeUserStates({
		getUserResultsOp,
		rerender,
	}: {
		getUserResultsOp: () => Op<UserResult[]>
		rerender: () => void
	}) {

	const states = new Map<string, UserState2>()

	function cleanupObsoleteStates() {
		const userIdsPendingRemovalFromState: string[] = []
		const userResultsOp = getUserResultsOp()
		if (ops.ready(userResultsOp)) {
			const userResults = ops.value(userResultsOp)
			for (const stateUserId of states.keys()) {
				const userIsGone = !userResults.find(({user}) => user.userId === stateUserId)
				if (userIsGone)
					userIdsPendingRemovalFromState.push(stateUserId)
			}
		}
		for (const obsoleteUserId of userIdsPendingRemovalFromState)
			states.delete(obsoleteUserId)
	}

	function obtainStateForUser(userId: string) {
		let state: UserState2 = states.get(userId)
		if (!state) {
			const newState: UserState2 = {
				editMode: false,
				toggleEditMode() {
					newState.editMode = !newState.editMode
					rerender()
				},
			}
			state = newState
			states.set(userId, state)
		}
		return state
	}

	return {
		cleanupObsoleteStates,
		obtainStateForUser,
	}
}
