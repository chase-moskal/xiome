
import * as renraku from "renraku"

import {ChatConnect} from "../../common/types/chat-concepts.js"
import {makeChatServerCore} from "../cores/chat-server-core.js"

export function chatMockClient(
		serverCore: ReturnType<typeof makeChatServerCore>
	): ChatConnect {

	return async function chatConnect({clientsideApi, handleDisconnect}) {

		const clientside = renraku.mock()
			.forApi(clientsideApi)
			.withMetaMap({chatClient: async() => {}})

		const {api, disconnect} = serverCore.acceptNewClient({
			headers: {},
			controls: {
				ping() {},
				close() {},
			},
			clientside,
			handleDisconnect: () => {},
		})

		return {
			serverside: renraku.mock()
				.forApi(api)
				.withMetaMap({chatServer: async() => {}}),
			disconnect() {
				disconnect()
				handleDisconnect()
			},
		}
	}
}
