
import {getRando} from "../../../../toolbox/get-rando.js"
import {makeChatServerCore} from "../cores/chat-server-core.js"
import {prepareChatClientCore} from "../cores/chat-client-core.js"
import {mockChatPolicy} from "../../testing/mocks/mock-chat-policy.js"
import {mockChatPersistence} from "../cores/persistence/mock-chat-persistence.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function chatMockClient({storage}: {
		storage: FlexStorage
	}) {

	const rando = await getRando()
	const persistence = await mockChatPersistence(storage)

	const servelet = makeChatServerCore({
		rando,
		persistence,
		policy: mockChatPolicy,
		logError(error) {
			console.error(error)
		},
	})

	const {chatConnect} = prepareChatClientCore({
		connectToServer: async({handleDataFromServer}) => {
			const serverConnection = await servelet.acceptConnection({
				disconnect: () => {},
				sendDataToClient: handleDataFromServer,
			})
			return {
				sendDataToServer: serverConnection.handleDataFromClient,
				disconnect: async() => serverConnection.handleDisconnect(),
			}
		}
	})

	return chatConnect
}
