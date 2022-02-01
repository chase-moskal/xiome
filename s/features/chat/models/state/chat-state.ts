
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {ChatConnection, ChatPost, ChatStats, ChatStatus, StatsForChatRoom} from "../../common/types/chat-concepts.js"

export function makeChatState() {
	return snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		connectionOp: ops.none() as Op<ChatConnection>,
		cache: {
			mutedUserIds: [] as string[],
			roomStats: {} as ChatStats,
			rooms: {} as {[key: string]: {
				status: ChatStatus
				posts: ChatPost[]
			}},
		},
	})
}
