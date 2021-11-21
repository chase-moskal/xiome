
import {ops} from "../../../../framework/ops.js"
import {makeChatRoom} from "./make-chat-room.js"
import {makeChatState} from "../state/chat-state.js"
import {ChatConnection} from "../../common/types/chat-concepts.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"

export function setupRoomManagement({state, reconnect, disconnect}: {
		state: ReturnType<typeof makeChatState>
		reconnect: () => Promise<ChatConnection>
		disconnect: () => Promise<void>
	}) {

	async function assertConnection() {
		return ops.isReady(state.readable.connectionOp)
			? ops.value(state.readable.connectionOp)
			: reconnect()
	}

	const followers = new Map<string, Set<symbol>>()
	const rooms = new Map<string, Promise<ReturnType<typeof makeChatRoom>>>()

	function assertFollowing(label: string) {
		let following = followers.get(label)
		if (!following) {
			following = new Set()
			followers.set(label, following)
		}
		return following
	}

	function assertRoom(label: string) {
		let room = rooms.get(label)
		if (!room) {
			room = assertConnection()
				.then(connection =>
					connection.serverRemote.roomSubscribe(label)
						.then(() => connection)
				)
				.then(connection =>
					makeChatRoom({
						label,
						state,
						serverRemote: connection.serverRemote,
					})
				)
			rooms.set(label, room)
		}
		return room
	}

	function removeRoom(label: string) {
		const room = rooms.get(label)
		assertConnection()
			.then(connection =>
				room.then(r => {
					connection.serverRemote.roomUnsubscribe(label)
				})
			)
			.then(() => {
				rooms.delete(label)
				if (rooms.size === 0) {
					return disconnect()
				}
			})
	}

	async function getRoomSession(label: string) {
		const following = assertFollowing(label)
		const follower = Symbol()
		following.add(follower)

		function dispose() {
			following.delete(follower)
			if (following.size === 0)
				removeRoom(label)
		}

		return {
			dispose,
			room: await assertRoom(label),
		}
	}

	async function updateAuthSituation(auth: boolean) {
		if (auth) {
			if (rooms.size > 0)
				await assertConnection()
		}
		else
			if (rooms.size === 0)
				await disconnect()
	}

	return {getRoomSession, updateAuthSituation}
}
