
import {Op, ops} from "../../../../framework/ops.js"
import {UserResult} from "../../api/types/user-result.js"
import {EditWidget} from "../types/edit-widget.js"
import {UserState} from "../types/user-state.js"

export function makeUserStates({
		getUserResultsOp,
		requestUpdate,
	}: {
		getUserResultsOp: () => Op<UserResult[]>
		requestUpdate: () => void
	}) {

	function makeEditWidgetState(): EditWidget {
		return {
			roleChanges: {},
			assignRole(roleId: string) {
				console.log("SET ASSIGN", roleId)
			},
			revokeRole(roleId: string) {
				console.log("SET REVOKE", roleId)
			},
			async save() {
				console.log("SAVE ALL ASSIGNS AND REVOKES")
			},
		}
	}

	const states = new Map<string, UserState>()

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
		let state: UserState = states.get(userId)
		if (!state) {
			const newState: UserState = {
				editWidget: false,
				toggleEditWidget: () => {
					newState.editWidget = newState.editWidget === false
						? makeEditWidgetState()
						: false
					requestUpdate()
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
