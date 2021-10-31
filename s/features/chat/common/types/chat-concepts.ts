
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {prepareServersideHandlers} from "../../api/handlers/prepare-serverside-handlers.js"

export interface ChatMeta {
	accessToken: string
	chat: string
}

export interface ChatAuth {
	access: AccessPayload
	chat: string
}

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

export interface ChatClient extends ReturnType<typeof prepareServersideHandlers> {
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
}

export interface LocalChatCache {}

export type ConnectChatClient = ({chat, cache}: {
	chat: string
	cache: LocalChatCache
}) => Promise<ChatClient>

export enum ChatState {
	Offline,
	Online,
}
