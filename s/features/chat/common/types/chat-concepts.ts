
import {Await} from "../../../../types/await.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {mockChatPersistence} from "../../api/cores/persistance/mock-chat-persistence.js"
import {prepareChatClientsideLogic} from "../../api/cores/logic/chat-clientside-logic.js"
import {prepareChatServersideLogic} from "../../api/cores/logic/chat-serverside-logic.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"

export interface ChatMeta {
	accessToken: string
}

export interface ChatAuth {
	access: AccessPayload
}

export type ChatPolicy = (meta: ChatMeta) => Promise<ChatAuth>

export type ChatDraft = {
	room: string
	nickname: string
	content: string
}

export type ChatPost = {
	messageId: string
	userId: string
	time: number
} & ChatDraft

export type ChatPostRow = {
	messageId: DamnId
	userId: DamnId
	time: number
} & ChatDraft

export type ChatRoomStatusRow = {
	room: string
	status: ChatStatus
}

export type ChatTables = {
	chatPosts: DbbyTable<ChatPostRow>
	chatRoomStatus: DbbyTable<ChatRoomStatusRow>
}

export interface ClientRecord {
	auth: undefined | ChatAuth
	clientRemote: ReturnType<typeof prepareChatClientsideLogic>
}

export type ChatPersistence = Await<ReturnType<typeof mockChatPersistence>>

export interface ChatConnection {
	serverRemote: ReturnType<typeof prepareChatServersideLogic>
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
}

export type ChatConnect = ({handlers}: {
	handlers: ReturnType<typeof prepareChatClientsideLogic>
}) => Promise<ChatConnection>

export enum ChatStatus {
	Offline,
	Online,
}

export interface ChatRoom {
	readonly status: ChatStatus
	setRoomStatus(status: ChatStatus): void
}
