
import {ops} from "../../../framework/ops.js"
import {makeChatModel} from "../models/chat-model.js"
import {getRando} from "../../../toolbox/get-rando.js"
import {makeChatServelet} from "../api/chat-servelet.js"
import {mockChatMeta, mockChatPolicy} from "./mocks/mock-meta-and-policy.js"
import {prepareClientConnector} from "../api/client-connector.js"

export async function testChatSetup() {
	const rando = await getRando()

	async function makeServer() {
		const servelet = makeChatServelet({
			policy: mockChatPolicy,
		})

		async function makeClient() {
			const connectChatClient = prepareClientConnector({
				getAccessToken: async() => "a123",
				connectToServer: async({handleDataFromServer}) => {
					const serverConnection = await servelet.acceptConnection({
						disconnect: () => {},
						sendDataToClient: handleDataFromServer,
					})
					return {
						sendDataToServer: handleDataFromServer,
						disconnect: async() => serverConnection.handleDisconnect(),
					}
				},
			})
			const userId = rando.randomId().toString()
			const access = {
				appId: undefined,
				origins: [],
				permit: {privileges: []},
				scope: {core: false},
				user: {
					userId,
					profile: {
						avatar: undefined,
						nickname: `nickname-${userId.slice(0, 7)}`,
						tagline: "",
					},
					roles: [],
					stats: undefined,
				},
			}
			const chatModel = makeChatModel({
				connectChatClient,
				getChatMeta: async() => mockChatMeta({access}),
			})
			await chatModel.updateAccessOp(ops.ready(access))
			return {chatModel}
		}

		return {makeClient}
	}

	return {makeServer}
}
