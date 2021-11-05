
import {ops} from "../../../framework/ops.js"
import {makeChatModel} from "../models/chat-model.js"
import {getRando} from "../../../toolbox/get-rando.js"
import {chatPrivileges} from "../common/chat-privileges.js"
import {makeChatServerCore} from "../api/cores/chat-server-core.js"
import {prepareChatClientCore} from "../api/cores/chat-client-core.js"
import {mockChatMeta, mockChatPolicy} from "./mocks/mock-meta-and-policy.js"

export async function testChatSetup() {
	const rando = await getRando()

	async function makeServer() {
		const servelet = makeChatServerCore({
			policy: mockChatPolicy,
		})

		async function makeClient(privileges: string[]) {
			const {connect} = prepareChatClientCore({
				connectToServer: async({handleDataFromServer}) => {
					const serverConnection = await servelet.acceptConnection({
						disconnect: () => {},
						sendDataToClient: handleDataFromServer,
					})
					return {
						sendDataToServer: serverConnection.handleDataFromClient,
						disconnect: async() => serverConnection.handleDisconnect(),
					}
				},
			})
			const userId = rando.randomId().toString()
			const access = {
				appId: undefined,
				origins: [],
				permit: {privileges},
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
				connect,
				getChatMeta: async() => mockChatMeta({access}),
			})
			await chatModel.updateAccessOp(ops.ready(access))
			return {chatModel}
		}

		return {
			makeClientFor: {
				forbidden: () => makeClient([]),
				viewer: () => makeClient([chatPrivileges["view all chats"]]),
				participant: () => makeClient([chatPrivileges["participate in all chats"]]),
				moderator: () => makeClient([chatPrivileges["moderate all chats"]]),
			},
		}
	}

	return {makeServer}
}
