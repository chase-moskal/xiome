
import type * as renraku from "renraku"

import type {Await} from "../../../../types/await.js"
import type {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import type {AccessPayload} from "../../../auth/types/auth-tokens.js"
import type {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"
import type {makeChatServerside} from "../../api/services/chat-serverside.js"
import type {makeChatClientside} from "../../api/services/chat-clientside.js"
import type {mockChatPersistence} from "../../api/cores/persistence/mock-chat-persistence.js"

export interface ChatMeta {
	accessToken: string
}

export interface ChatAuth {
	access: AccessPayload
}

export type ChatPolicy = (meta: ChatMeta, headers: renraku.HttpHeaders) => Promise<ChatAuth>

export type ChatDraft = {
	content: string
}

export type ChatPost = {
	room: string
	nickname: string
	postId: string
	userId: string
	time: number
} & ChatDraft

export type ChatPostRow = {
	room: string
	postId: DamnId
	userId: DamnId
	time: number
	nickname: string
} & ChatDraft

export type ChatMute = {
	userId: string
}

export type ChatMuteRow = {
	userId: DamnId
}

export type ChatRoomStatusRow = {
	room: string
	status: ChatStatus
}

export type ChatMuteRow = {
  userId: DamnId
}

export type ChatTables = {
	posts: DbbyTable<ChatPostRow>
	mutes: DbbyTable<ChatMuteRow>
	roomStatuses: DbbyTable<ChatRoomStatusRow>
}

export type ChatPersistence = Await<ReturnType<typeof mockChatPersistence>>
export type ChatPersistenceActions = ReturnType<ChatPersistence["namespaceForApp"]>

export type ChatServersideApi = ReturnType<typeof makeChatServerside>
export type ChatClientsideApi = ReturnType<typeof makeChatClientside>

export type ChatServerside = renraku.Remote<ChatServersideApi>
export type ChatClientside = renraku.Remote<ChatClientsideApi>

export interface ClientRecord {
	rooms: Set<string>
	auth: undefined | ChatAuth
	clientside: ChatClientside
	controls: renraku.ConnectionControls
}

export interface ChatConnection {
	serverside: ChatServerside
	disconnect(): void
}

export type ChatConnect = ({clientsideApi}: {
	clientsideApi: ChatClientsideApi
	handleDisconnect(): void
}) => Promise<ChatConnection>

export enum ChatStatus {
	Offline,
	Online,
}
