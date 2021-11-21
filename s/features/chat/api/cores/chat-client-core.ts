
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {ChatConnect, ChatServersideLogic} from "../../common/types/chat-concepts.js"

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
		async chatConnect({clientsideLogic}) {
			const handleDataFromServer = lingoHost(clientsideLogic)

			const connection = await connectToServer({
				handleDataFromServer,
			})

			const serverRemote = lingoRemote<ChatServersideLogic>({
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
