
import {ops} from "../../../../framework/ops.js"
import {makeChatRoom} from "./make-chat-room.js"
import {makeChatState} from "../state/chat-state.js"
import {ChatConnection} from "../../common/types/chat-concepts.js"

export function setupRoomManagement({state, reconnect}: {
		state: ReturnType<typeof makeChatState>
		reconnect: () => Promise<ChatConnection>
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

	function assertRoom(label: string, dispose: () => void) {
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
						dispose,
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
					return connection
				})
			)
			.then(connection => {
				rooms.delete(label)
				if (rooms.size === 0) {
					connection.disconnect()
				}
			})
	}

	async function getRoom(label: string) {
		const following = assertFollowing(label)
		const follower = Symbol()
		following.add(follower)
		function dispose() {
			following.delete(follower)
			if (following.size === 0) {
				removeRoom(label)
			}
		}
		return assertRoom(label, dispose)
	}

	return {getRoom}
}
