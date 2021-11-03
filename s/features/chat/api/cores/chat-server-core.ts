
import {chatClientsideShape} from "../handlers/chat-clientside-shape.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {ChatPolicy, ClientsideHandlers} from "../../common/types/chat-concepts.js"
import {prepareChatServersideLogic} from "../handlers/chat-serverside-logic.js"

export function makeChatServerCore({policy}: {
		policy: ChatPolicy
	}) {

	let clientCount = 0

	async function acceptConnection({disconnect, sendDataToClient}: {
			disconnect(): void
			sendDataToClient: (...args: any[]) => Promise<void>
		}) {

		clientCount += 1

		const clientside = lingoRemote<ClientsideHandlers>({
			shape: chatClientsideShape,
			send: sendDataToClient,
		})

		return {
			handleDataFromClient: lingoHost(prepareChatServersideLogic({
				clientside,
				database: undefined,
				policy,
			})),
			handleDisconnect() {
				clientCount -= 1
				disconnect()
			},
		}
	}

	return {
		acceptConnection,
		getClientCount: () => clientCount,
	}
}
