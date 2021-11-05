
import {waiter} from "./machinery/waiter.js"
import {ChatConnect} from "../../common/types/chat-concepts.js"
import {lingoHost, lingoRemote} from "../../../../toolbox/lingo/lingo.js"
import {prepareChatServersideLogic} from "../handlers/chat-serverside-logic.js"

export function prepareChatClientCore({connectToServer}: {
			connectToServer: ({}: {
					handleDataFromServer: (key: string, ...args: any[]) => Promise<void>
				}) => Promise<{
				disconnect: () => Promise<void>
				sendDataToServer: (key: string, ...args: any[]) => Promise<void>
			}>
		}): {
			connect: ChatConnect
		} {

	return {
		async connect({handlers}) {
			const handleDataFromServer = lingoHost(handlers)

			const connection = await connectToServer({
				handleDataFromServer,
			})

			const serverRemote = lingoRemote<ReturnType<typeof prepareChatServersideLogic>>({
				send: connection.sendDataToServer,
			})

			const {resolveWaiters, waitForMessageFromServer} = waiter()

			return ({
				serverRemote,
				waitForMessageFromServer,
				handleDataFromServer: async(key, ...args) => {
					resolveWaiters(key, ...args)
					return handleDataFromServer(key, ...args)
				},
				async disconnect() {
					await connection.disconnect()
				},
			})
		},
	}
}
