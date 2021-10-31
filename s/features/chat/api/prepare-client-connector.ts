
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {ChatMeta, ConnectChatClient} from "../common/types/chat-concepts.js"
import {prepareClientsideHandlers} from "./handlers/prepare-clientside-handlers.js"
import {prepareServersideHandlers, serversideShape} from "./handlers/prepare-serverside-handlers.js"

export function prepareClientConnector({connectToServer, getAccessToken}: {
			getAccessToken(): Promise<string>
			connectToServer: ({}: {
					meta: ChatMeta,
					handleDataFromServer: (...args: any[]) => Promise<void>
				}) => Promise<{
				disconnect: () => Promise<void>
				sendDataToServer: (...args: any[]) => Promise<void>
			}>
		}): ConnectChatClient {

	return async({chat, cache}) => {
		const handleDataFromServer = lingoHost(prepareClientsideHandlers({
			cache,
		}))

		const connection = await connectToServer({
			handleDataFromServer,
			meta: {
				chat,
				accessToken: await getAccessToken()
			},
		})

		return ({
			...lingoRemote<ReturnType<typeof prepareServersideHandlers>>({
				shape: serversideShape,
				send: connection.sendDataToServer,
			}),
			async disconnect() {
				await connection.disconnect()
			},
			handleDataFromServer,
		})
	}
}
