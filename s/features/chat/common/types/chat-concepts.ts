
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {prepareServersideHandlers} from "../../api/handlers/prepare-serverside-handlers.js"

export interface ChatMeta {
	accessToken: string
}

export interface ChatAuth {
	access: AccessPayload
}

export type ChatPolicy = (meta: ChatMeta) => Promise<ChatAuth>

export type ChatMessageDraft = {
	nickname: string
	content: string
}

export type ChatMessage = {
	messageId: string
	userId: string
	time: string
} & ChatMessageDraft

export interface ChatDatabase {
}

export type ClientsideHandlers = {
	chatStatusChange(chat: string, status: ChatStatus): Promise<void>
	populateNewMessages(chat: string, messages: ChatMessage[]): Promise<void>
	deleteMessages(chat: string, messageIds: string[]): Promise<void>
	muteUsers(userIds: string[]): Promise<void>
}

export interface ChatClient extends ReturnType<typeof prepareServersideHandlers> {
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
}

export type ConnectChatClient = ({handlers}: {
	handlers: ClientsideHandlers
}) => Promise<ChatClient>

export enum ChatStatus {
	Offline,
	Online,
}
