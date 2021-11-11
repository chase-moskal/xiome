
import {onesie} from "../../../toolbox/onesie.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeChatState} from "./state/chat-state.js"
import {chatAllowance} from "../common/chat-allowance.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {setupRoomManagement} from "./room/room-management.js"
import {ChatMeta, ChatConnect} from "../common/types/chat-concepts.js"
import {prepareChatClientsideLogic} from "../api/cores/logic/chat-clientside-logic.js"

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

	async function disconnect() {
		const connection = ops.value(state.readable.connectionOp)
		state.writable.connectionOp = ops.none()
		await connection.disconnect()
	}

	const roomManagement = setupRoomManagement({
		state,
		reconnect,
		disconnect,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,

		get allowance() {
			const access = ops.value(state.readable.accessOp)
			const privileges = access?.permit.privileges ?? []
			return chatAllowance(privileges)
		},

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			await reconnect()
		},

		session: roomManagement.getRoomSession,
	}
}
