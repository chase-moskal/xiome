
import {onesie} from "../../../toolbox/onesie.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeChatState} from "./state/chat-state.js"
import {chatPrivileges} from "../common/chat-privileges.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {prepareChatClientsideLogic} from "../api/cores/logic/chat-clientside-logic.js"
import {ChatMeta, ChatStatus, ChatConnect, ChatRoom, ChatServersideLogic} from "../common/types/chat-concepts.js"

export function makeChatModel({chatConnect, getChatMeta}: {
		chatConnect: ChatConnect
		getChatMeta: () => Promise<ChatMeta>
	}) {

	const state = makeChatState()
	const clientsideLogic = prepareChatClientsideLogic({state})

	const reconnect = onesie(async function() {
		const connection = ops.value(state.readable.connectionOp)
			?? await ops.operation({
				setOp: op => state.writable.connectionOp = op,
				promise: chatConnect({clientsideLogic}),
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

	function makeChatRoom({label, serverRemote}: {
			label: string
			serverRemote: ChatServersideLogic
		}) {
		const getCacheRoom = () => state.readable.cache.rooms[label]
		return {
			get status() {
				return getCacheRoom().status
			},
			setRoomStatus(status: ChatStatus) {
				serverRemote.setRoomStatus(label, status)
			},
		}
	}

	const roomManager = (() => {
		const rooms = new Map<string, Promise<ChatRoom>>()
		return {
			assertRoom(label: string) {
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
								serverRemote: connection.serverRemote,
							})
						)
				}
				return room
			}
		}
	})()

	return {
		state: state.readable,
		subscribe: state.subscribe,

		get allowance() {
			const access = ops.value(state.readable.accessOp)
			const privileges = access?.permit.privileges ?? []
			return {
				moderateAllChats:
					privileges.includes(chatPrivileges["moderate all chats"]),
				participateInAllChats:
					privileges.includes(chatPrivileges["moderate all chats"]) ||
					privileges.includes(chatPrivileges["participate in all chats"]),
				viewAllChats:
					privileges.includes(chatPrivileges["moderate all chats"]) ||
					privileges.includes(chatPrivileges["participate in all chats"]) ||
					privileges.includes(chatPrivileges["view all chats"]),
			}
		},

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			await reconnect()
		},

		async room(label: string) {
			return roomManager.assertRoom(label)
		},
	}
}
