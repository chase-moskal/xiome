
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
	time: number
}

export type ChatMessage = {
	userId: string
	nickname: string
	content: string
	time: number
}

export interface ChatDatabase {
}

export interface ChatClient extends ReturnType<typeof prepareServersideHandlers> {
	disconnect(): Promise<void>
	handleDataFromServer(...args: any): Promise<void>
}

export type ConnectChatClient = ({chat}: {
	chat: string
}) => Promise<ChatClient>

export interface LocalChatCache {}

export enum ChatState {
	Offline,
	Online,
}
