
import type * as renraku from "renraku"
import {Id} from "dbmage"
import * as dbmage from "dbmage"

import type {Await} from "../../../../types/await.js"
import type {AccessPayload} from "../../../auth/types/auth-tokens.js"
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
	postId: Id
	userId: Id
	time: number
	nickname: string
} & ChatDraft

export type ChatMute = {
	userId: string
}

export type ChatMuteRow = {
	userId: Id
}

export type ChatRoomStatusRow = {
	room: string
	status: ChatStatus
}

export type ChatSchema = dbmage.AsSchema<{
	posts: ChatPostRow
	mutes: ChatMuteRow
	roomStatuses: ChatRoomStatusRow
	roomUsers: {room: string, user?: Id, participant: boolean}
}>

export type ChatShape = dbmage.SchemaToShape<ChatSchema>
export const chatShape: ChatShape = {
	posts: true,
	mutes: true,
	roomStatuses: true,
	roomUsers: true,
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

export interface ChatRoomStats {
	totalUsers: number
	viewers: number
	participants: number
	moderators: number
}

export interface StatsForChatRoom {
	[roomName: string]: ChatRoomStats
}

export interface ChatStats {
	numberOfConnections: number
	statsForRooms: StatsForChatRoom
}
