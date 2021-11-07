
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {ChatAuth, ChatMeta} from "../../common/types/chat-concepts.js"

const signToken = mockSignToken()
const verifyToken = mockVerifyToken()

export async function mockChatMeta({access}: ChatAuth): Promise<ChatMeta> {
	return {accessToken: await signToken({
		payload: access,
		lifespan: 10 * (1000 * 60 * 60 * 24),
	})}
}

export async function mockChatPolicy(
			{accessToken}: ChatMeta
		): Promise<ChatAuth> {
	return {access: await verifyToken(accessToken)}
}
