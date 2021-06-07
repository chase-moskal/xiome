
import {User} from "../../../auth/types/user.js"
import {Op, ops} from "../../../../framework/ops.js"

export function makeUserStateGetter({
		getUsersOp,
		requestUpdate,
	}: {
		getUsersOp: () => Op<User[]>
		requestUpdate: () => void
	}) {

	type EditWidget = {
		roleChanges: {
			[userId: string]: undefined | "assign" | "revoke"
		}
	}

	type UserState = {
		editWidget: false | EditWidget
		toggleEditWidget: () => void
	}

	const states = new Map<string, UserState>()

	const removeStatesForUsersThatAreGone = () => {
		const userIdsPendingRemovalFromState: string[] = []
		const usersOp = getUsersOp()
		if (ops.ready(usersOp)) {
			const users = ops.value(usersOp)
			for (const stateUserId of states.keys()) {
				const userIsGone = !users.find(user => user.userId === stateUserId)
				if (userIsGone)
					userIdsPendingRemovalFromState.push(stateUserId)
			}
		}
		for (const obsoleteUserId of userIdsPendingRemovalFromState)
			states.delete(obsoleteUserId)
	}

	return (userId: string): UserState => {
		removeStatesForUsersThatAreGone()
		let state: UserState = states.get(userId)
		if (!state) {
			const newState: UserState = {
				editWidget: false,
				toggleEditWidget: () => {
					newState.editWidget = newState.editWidget === false
						? {roleChanges: {}}
						: false
					requestUpdate()
				},
			}
			state = newState
			states.set(userId, state)
		}
		return state
	}
}
