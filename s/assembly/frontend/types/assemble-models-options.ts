
import {SystemRemote} from "./system-remote.js"
import {SystemPopups} from "../connect/system-popups/types/system-popups.js"
import {FlexStorage} from "dbmage"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"
import {ChatConnect} from "../../../features/chat/common/types/chat-concepts.js"

export interface AssembleModelsOptions {
	appId: string
	remote: SystemRemote
	popups: SystemPopups
	storage: FlexStorage
	authMediator: AuthMediator
	chatConnect: ChatConnect
}
