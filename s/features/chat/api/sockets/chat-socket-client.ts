
import * as renraku from "renraku/x/websocket/socket-client.js"
import {ChatConnect, ChatServersideApi} from "../../common/types/chat-concepts.js"

export function chatSocketClient(link: string): ChatConnect {
	return async function chatConnect({clientsideApi, handleDisconnect}) {
		const {remote, close} = await renraku
			.webSocketClient<ChatServersideApi>({
				link,
				timeout: 60_000,
				clientApi: clientsideApi,
				metaMap: {chatServer: async() => {}},
				handleConnectionClosed: handleDisconnect,
		})
		return {
			serverside: remote,
			disconnect: close,
		}
	}
}
