
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {DataParams, Sniffer} from "../../api/cores/machinery/waiter.js"
import {prepareChatClientsideLogic} from "../../api/cores/logic/chat-clientside-logic.js"
import {prepareChatServersideLogic} from "../../api/cores/logic/chat-serverside-logic.js"

export interface ChatMeta {
	accessToken: string
}

export interface ChatAuth {
	access: AccessPayload
}

export type ChatPolicy = (meta: ChatMeta) => Promise<ChatAuth>

export type ChatDraft = {
	nickname: string
	content: string
}

export type ChatPost = {
	messageId: string
	userId: string
	time: string
} & ChatDraft

export interface ClientRecord {
	auth: undefined | ChatAuth
	clientRemote: ReturnType<typeof prepareChatClientsideLogic>
}

export interface ChatConnection {
	serverRemote: ReturnType<typeof prepareChatServersideLogic>
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
	// waitForMessageFromServer(
	// 	sniffer: Sniffer
	// ): Promise<DataParams>
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
