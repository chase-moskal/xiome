
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {makeChatServerGlobalist} from "./globalist/chat-server-globalist.js"
import {ChatPolicy, ClientRecord} from "../../common/types/chat-concepts.js"
import {prepareChatServersideLogic} from "./logic/chat-serverside-logic.js"
import {prepareChatClientsideLogic} from "./logic/chat-clientside-logic.js"

export function makeChatServerCore({policy}: {
		policy: ChatPolicy
	}) {

	const clientRecords = new Set<ClientRecord>()
	const globalist = makeChatServerGlobalist(clientRecords)

	async function acceptConnection({disconnect, sendDataToClient}: {
			disconnect(): void
			sendDataToClient: (...args: any[]) => Promise<void>
		}) {

		const clientRecord: ClientRecord = {
			auth: undefined,
			clientRemote: lingoRemote<
						ReturnType<typeof prepareChatClientsideLogic>
					>({
				send: sendDataToClient
			}),
		}

		clientRecords.add(clientRecord)

		return {
			handleDataFromClient: lingoHost(prepareChatServersideLogic({
				globalist,
				clientRecord,
				policy,
			})),
			handleDisconnect() {
				disconnect()
				clientRecords.delete(clientRecord)
			},
		}
	}

	return {
		acceptConnection,
		get clientCount() { return clientRecords.size },
	}
}
