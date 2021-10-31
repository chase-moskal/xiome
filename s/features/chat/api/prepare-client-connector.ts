
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {ChatMeta, ConnectChatClient} from "../common/types/chat-concepts.js"
import {prepareClientsideHandlers} from "./handlers/prepare-clientside-handlers.js"
import {prepareServersideHandlers} from "./handlers/prepare-serverside-handlers.js"

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

	return async({chat}) => {
		const handleDataFromServer = lingoHost(prepareClientsideHandlers({
			cache: undefined,
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
				send: connection.sendDataToServer,
				shape: {
					postMessage: true,
				},
			}),
			async disconnect() {
				await connection.disconnect()
			},
			handleDataFromServer,
		})
	}
}
