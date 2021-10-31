
import {ChatAuth, ChatMeta} from "../../common/types/chat-concepts.js"

export function mockChatMeta({access}: ChatAuth): ChatMeta {
	return {accessToken: JSON.stringify(access)}
}

export async function mockChatPolicy(
			{accessToken}: ChatMeta
		): Promise<ChatAuth> {
	return {access: JSON.parse(accessToken)}
}
