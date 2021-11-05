
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {DataParams, Sniffer} from "../../api/cores/machinery/waiter.js"
import {prepareChatServersideLogic} from "../../api/handlers/chat-serverside-logic.js"

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

export interface ChatDatabase {
}

export type ChatClientHandlers = {
	roomStatus(room: string, status: ChatStatus): Promise<void>
	posted(room: string, messages: ChatPost[]): Promise<void>
	deleted(room: string, messageIds: string[]): Promise<void>
	cleared(room: string): Promise<void>
	muted(userIds: string[]): Promise<void>
}

export interface ChatConnection {
	serverRemote: ReturnType<typeof prepareChatServersideLogic>
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
	waitForMessageFromServer(
		sniffer: Sniffer
	): Promise<DataParams>
}

export type ChatConnect = ({handlers}: {
	handlers: ChatClientHandlers
}) => Promise<ChatConnection>

export enum ChatStatus {
	Offline,
	Online,
}
