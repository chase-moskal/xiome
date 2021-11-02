
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {ChatMeta, ConnectChatClient} from "../../common/types/chat-concepts.js"
import {prepareChatServersideLogic, chatServersideShape} from "../handlers/chat-serverside-logic.js"

export function prepareChatClientCore({connectToServer, getAccessToken}: {
			getAccessToken(): Promise<string>
			connectToServer: ({}: {
					handleDataFromServer: (...args: any[]) => Promise<void>
				}) => Promise<{
				disconnect: () => Promise<void>
				sendDataToServer: (...args: any[]) => Promise<void>
			}>
		}): ConnectChatClient {

	return async({handlers}) => {
		const handleDataFromServer = lingoHost(handlers)

		const connection = await connectToServer({
			handleDataFromServer,
		})

		const serverRemote = lingoRemote<ReturnType<typeof prepareChatServersideLogic>>({
			shape: chatServersideShape,
			send: connection.sendDataToServer,
		})

		const meta = {accessToken: await getAccessToken()}
		await serverRemote.updateUserMeta(meta)

		return ({
			...serverRemote,
			async disconnect() {
				await connection.disconnect()
			},
			handleDataFromServer,
		})
	}
}
