
import {nap} from "../../../toolbox/nap.js"
import {getRando} from "../../../toolbox/get-rando.js"
import {chatPrivileges} from "../common/chat-privileges.js"
import {ClientRecord} from "../common/types/chat-concepts.js"
import {mockAccess} from "../../../common/testing/mock-access.js"
import {mockChatMeta, mockChatPolicy} from "./mocks/mock-chat-policy.js"
import {mockChatPersistence} from "../api/cores/persistence/mock-chat-persistence.js"
import {prepareChatServersideLogic} from "../api/cores/logic/chat-serverside-logic.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"

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
		clientRemote: {
			postsAdded: doNothing,
			postsRemoved: doNothing,
			roomCleared: doNothing,
			roomStatusChanged: doNothing,
			unmuteAll: doNothing,
			usersMuted: doNothing,
			usersUnmuted: doNothing,
		},
	}

	const chatServersideLogic = prepareChatServersideLogic({
		rando,
		persistence,
		clientRecord,
		policy: mockChatPolicy,
	})

	await chatServersideLogic.updateUserMeta(meta)
	await nap()

	return {
		meta,
		chatServersideLogic,
	}
}
