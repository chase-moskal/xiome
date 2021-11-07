
import {ChatConnect} from "../../common/types/chat-concepts.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {prepareChatServersideLogic} from "./logic/chat-serverside-logic.js"

export function prepareChatClientCore({connectToServer}: {
			connectToServer: ({}: {
					handleDataFromServer: (key: string, ...args: any[]) => Promise<void>
				}) => Promise<{
				disconnect: () => Promise<void>
				sendDataToServer: (key: string, ...args: any[]) => Promise<void>
			}>
		}): {
			chatConnect: ChatConnect
		} {

	return {
		async chatConnect({handlers}) {
			const handleDataFromServer = lingoHost(handlers)

			const connection = await connectToServer({
				handleDataFromServer,
			})

			const serverRemote = lingoRemote<ReturnType<typeof prepareChatServersideLogic>>({
				send: connection.sendDataToServer,
			})

			return ({
				serverRemote,
				handleDataFromServer,
				async disconnect() {
					await connection.disconnect()
				},
			})
		},
	}
}
