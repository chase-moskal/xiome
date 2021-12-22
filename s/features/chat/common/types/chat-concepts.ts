
import {Await} from "../../../../types/await.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {mockChatPersistence} from "../../api/cores/persistence/mock-chat-persistence.js"
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
} & ChatDraft

export type ChatMuteRow = {
	userId: DamnId
}

export type ChatRoomStatusRow = {
	room: string
	status: ChatStatus
}

export type ChatTables = {
	posts: DbbyTable<ChatPostRow>
	mutes: DbbyTable<ChatMuteRow>
	roomStatuses: DbbyTable<ChatRoomStatusRow>
}

export interface ClientRecord {
	rooms: Set<string>
	auth: undefined | ChatAuth
	clientRemote: ReturnType<typeof prepareChatClientsideLogic>
}

export type ChatPersistence = Await<ReturnType<typeof mockChatPersistence>>
export type ChatServersideLogic = ReturnType<typeof prepareChatServersideLogic>
export type ChatClientsideLogic = ReturnType<typeof prepareChatClientsideLogic>

export interface ChatConnection {
	serverRemote: ChatServersideLogic
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
}

export type ChatConnect = ({clientsideLogic}: {
	clientsideLogic: ChatClientsideLogic
}) => Promise<ChatConnection>

export enum ChatStatus {
	Offline,
	Online,
}
