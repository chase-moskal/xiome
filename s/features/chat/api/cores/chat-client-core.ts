
import {ConnectChatClient} from "../../common/types/chat-concepts.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {prepareChatServersideLogic, chatServersideShape} from "../handlers/chat-serverside-logic.js"

export function prepareChatClientCore({connectToServer}: {
			connectToServer: ({}: {
					handleDataFromServer: (...args: any[]) => Promise<void>
				}) => Promise<{
				disconnect: () => Promise<void>
				sendDataToServer: (...args: any[]) => Promise<void>
			}>
		}): {
			connectChatClient: ConnectChatClient
		} {

	return {
		async connectChatClient({handlers}) {
			const handleDataFromServer = lingoHost(handlers)

			const connection = await connectToServer({
				handleDataFromServer,
			})

			const serverRemote = lingoRemote<ReturnType<typeof prepareChatServersideLogic>>({
				shape: chatServersideShape,
				send: connection.sendDataToServer,
			})

			return ({
				...serverRemote,
				handleDataFromServer,
				async disconnect() {
					await connection.disconnect()
				},
			})
		},
	}
}
