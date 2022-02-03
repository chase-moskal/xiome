
import {getRando, memoryFlexStorage} from "dbmage"

import {nap} from "../../../toolbox/nap.js"
import {ops} from "../../../framework/ops.js"
import {makeChatModel} from "../models/chat-model.js"
import {ChatStatus} from "../common/types/chat-concepts.js"
import {chatPrivileges} from "../common/chat-privileges.js"
import {chatMockClient} from "../api/sockets/chat-mock-client.js"
import {makeChatServerCore} from "../api/cores/chat-server-core.js"
import {mockChatMeta, mockChatPolicy} from "./mocks/mock-chat-policy.js"
import {mockChatPersistence} from "../api/cores/persistence/mock-chat-persistence.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

export async function testChatSetup() {
	const rando = await getRando()
	const storage = memoryFlexStorage()
	const persistence = await mockChatPersistence(storage)
	const defaultAppId = rando.randomId().toString()

	async function makeServer() {
		const serverCore = makeChatServerCore({
			rando,
			persistence,
			policy: mockChatPolicy,
		})

		async function makeClient(privileges: string[], appId = defaultAppId) {
			const userId = rando.randomId().toString()
			async function clone() {
				const chatConnect = chatMockClient(serverCore)
				let access = {
					appId,
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
					chatConnect,
					getChatMeta: async() => mockChatMeta({access}),
				})
				await chatModel.updateAccessOp(ops.ready(access))
				return {
					userId,
					chatModel,
					async addPrivilege(...privilegeKeys: (keyof typeof chatPrivileges)[]) {
						access = {
							...access,
							permit: {
								...access.permit,
								privileges: [
									...access.permit.privileges,
									...privilegeKeys.map(key => chatPrivileges[key]),
								],
							},
						}
						await chatModel.updateAccessOp(ops.ready(access))
					},
				}
			}
			return {
				...await clone(),
				clone,
			}
		}

		return {
			makeClientFor: {
				forbidden: (appId?: string) => makeClient([], appId),
				viewer: (appId?: string) => makeClient([chatPrivileges["view all chats"]], appId),
				participant: (appId?: string) => makeClient([chatPrivileges["participate in all chats"]], appId),
				moderator: (appId?: string) => makeClient([chatPrivileges["moderate all chats"]], appId),
				bannedParticipant: (appId?: string) => makeClient([
					chatPrivileges["participate in all chats"],
					appPermissions.privileges["banned"],
				], appId),
			},
		}
	}

	return {
		makeServer,
		async startOnline() {
			const server = await makeServer()
			const moderator = await server.makeClientFor.moderator()
			const roomLabel = "default"
			const {room, dispose} = await moderator.chatModel.session(roomLabel)
			room.setRoomStatus(ChatStatus.Online)
			await nap()
			dispose()
			await nap()
			return {server, moderator, roomLabel}
		},
	}
}
