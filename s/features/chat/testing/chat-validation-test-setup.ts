
import * as renraku from "renraku"

import {nap} from "../../../toolbox/nap.js"
import {getRando} from "dbmage"
import {chatPrivileges} from "../common/chat-privileges.js"
import {ClientRecord} from "../common/types/chat-concepts.js"
import {mockAccess} from "../../../common/testing/mock-access.js"
import {makeChatServerside} from "../api/services/chat-serverside.js"
import {mockChatMeta, mockChatPolicy} from "./mocks/mock-chat-policy.js"
import {RateLimiter} from "../../../toolbox/rate-limiter/rate-limiter.js"
import {mockChatPersistence} from "../api/cores/persistence/mock-chat-persistence.js"
import {memoryFlexStorage} from "dbmage"

export async function chatValidationTestSetup(
		...privileges: (keyof typeof chatPrivileges)[]
	) {
	const rando = await getRando()
	const storage = memoryFlexStorage()
	const persistence = await mockChatPersistence(storage)
	const doNothing = async() => {}

	const meta = await mockChatMeta({
		access: mockAccess({
			rando,
			privileges,
			appId: rando.randomId(),
			appOrigin: "https://xiome.io",
		})
	})

	const clientRecord: ClientRecord = {
		auth: undefined,
		rooms: new Set(),
		controls: {
			ping() {},
			close() {},
		},
		clientside: {
			chatClient: {
				postsAdded: doNothing,
				postsRemoved: doNothing,
				roomCleared: doNothing,
				roomStatusChanged: doNothing,
				unmuteAll: doNothing,
				usersMuted: doNothing,
				usersUnmuted: doNothing,
			},
		},
	}

	const serversideApi = makeChatServerside({
		rando,
		persistence,
		clientRecord,
		rateLimiter: new RateLimiter({
			maximum: 999,
			timeframe: 1000,
		}),
		headers: {},
		policy: mockChatPolicy,
		getStatsFromServerCore: (appId: string) => ({
			numberOfConnections: 0,
			statsForRooms: {},
		})
	})

	const serverside = renraku.mock()
		.forApi(serversideApi)
		.withMetaMap({chatServer: async() => {}})

	await serverside.chatServer.updateUserMeta(meta)
	await nap()

	return {
		meta,
		serverside,
	}
}
