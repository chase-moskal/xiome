
import {onesie} from "../../../toolbox/onesie.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeChatState} from "./state/chat-state.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {prepareChatClientsideLogic} from "../api/cores/logic/chat-clientside-logic.js"
import {ChatMeta, ChatStatus, ChatConnect, ChatRoom} from "../common/types/chat-concepts.js"

export function makeChatModel({chatConnect, getChatMeta}: {
		chatConnect: ChatConnect
		getChatMeta: () => Promise<ChatMeta>
	}) {

	const state = makeChatState()
	const handlers = prepareChatClientsideLogic({state})

	const reconnect = onesie(async function() {
		if (ops.isReady(state.readable.connectionOp)) {
			const connection = ops.value(state.readable.connectionOp)
			await connection.disconnect()
		}
		const connection = await ops.operation({
			setOp: op => state.writable.connectionOp = op,
			promise: chatConnect({handlers}),
		})
		const meta = await getChatMeta()
		await connection.serverRemote.updateUserMeta(meta)
		return connection
	})

	async function assertConnection() {
		return ops.isReady(state.readable.connectionOp)
			? ops.value(state.readable.connectionOp)
			: reconnect()
	}

	const rooms = new Map<string, Promise<ChatRoom>>()

	return {
		state: state.readable,
		subscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			await reconnect()
		},

		async room(label: string) {
			let chatRoom = rooms.get(label)
			if (!chatRoom) {
				chatRoom = assertConnection()
					.then(connection => 
						connection.serverRemote.roomSubscribe(label)
							.then(() => connection)
					)
					.then(connection => {
						const getRoom = () => state.readable.cache.rooms[label]
						return {
							get status() {
								return getRoom().status
							},
							setRoomStatus(status: ChatStatus) {
								connection.serverRemote.setRoomStatus(label, status)
							},
						}
					})
				rooms.set(label, chatRoom)
			}
			return chatRoom
		},

		// get waitForMessageFromServer() {
		// 	const connection = ops.value(state.readable.connectionOp)
		// 	if (!connection)
		// 		throw new Error("no connection, cannot wait for message from server")
		// 	return connection.waitForMessageFromServer
		// }
	}
}
