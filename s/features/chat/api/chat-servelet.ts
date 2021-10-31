
import {clientsideShape} from "./handlers/clientside-shape.js"
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {prepareServersideHandlers} from "./handlers/prepare-serverside-handlers.js"
import {ChatMeta, ChatPolicy, ClientsideHandlers} from "../common/types/chat-concepts.js"

export function makeChatServelet({policy}: {
		policy: ChatPolicy
	}) {

	let clientCount = 0

	async function acceptConnection({disconnect, sendDataToClient}: {
			disconnect(): void
			sendDataToClient: (...args: any[]) => Promise<void>
		}) {

		clientCount += 1

		const clientside = lingoRemote<ClientsideHandlers>({
			shape: clientsideShape,
			send: sendDataToClient,
		})
	
		return {
			handleDataFromClient: lingoHost(prepareServersideHandlers({
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
