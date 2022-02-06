
import {pub} from "../../../toolbox/pub.js"
import {onesie} from "../../../toolbox/onesie.js"
import {Op, ops} from "../../../framework/ops.js"
import {makeChatState} from "./state/chat-state.js"
import {chatAllowance} from "../common/chat-allowance.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {setupRoomManagement} from "./room/room-management.js"
import {makeStatsFetcher} from "./utilities/make-stats-fetcher.js"
import {makeChatClientside} from "../api/services/chat-clientside.js"
import {ChatMeta, ChatConnect} from "../common/types/chat-concepts.js"

export function makeChatModel({chatConnect, getChatMeta}: {
		chatConnect: ChatConnect
		getChatMeta: () => Promise<ChatMeta>
	}) {

	const changeEvent = pub()
	const state = makeChatState()
	const clientsideApi = makeChatClientside({
		state,
		onChange: changeEvent.publish,
	})
	const statsFetcher = makeStatsFetcher({state, intervalDuration: 2_000})

	const reconnect = onesie(async function() {
		const connection = ops.value(state.readable.connectionOp)
			?? await ops.operation({
				setOp: op => state.writable.connectionOp = op,
				promise: chatConnect({
					clientsideApi,
					handleDisconnect: () => state.writable.connectionOp = ops.none(),
				}),
			})
		const meta = await getChatMeta()
		await connection.serverside.chatServer.updateUserMeta(meta)
		statsFetcher.startInterval(connection)
		return connection
	})

	async function disconnect() {
		statsFetcher.stopInterval()
		const connection = ops.value(state.readable.connectionOp)
		if (connection) {
			connection.disconnect()
			state.writable.connectionOp = ops.none()
		}
	}

	const roomManagement = setupRoomManagement({
		state,
		reconnect,
		disconnect,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		subscribeToChange: changeEvent.subscribe,

		get allowance() {
			const access = ops.value(state.readable.accessOp)
			const privileges = access?.permit.privileges ?? []
			return chatAllowance(privileges)
		},

		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			const access = ops.value(op)
			await roomManagement.updateAuthSituation(!!access)
			const connection = ops.value(state.readable.connectionOp)
			if (connection) {
				const meta = await getChatMeta()
				await connection.serverside.chatServer.updateUserMeta(meta)
			}
		},

		session: roomManagement.getRoomSession,
		disconnect,
		reconnect,
	}
}
