
import {FlexStorage} from "dbmage"

import {SystemRemote} from "./system-remote.js"
import {StripePopups} from "../../../features/store/popups/types.js"
import {ChatConnect} from "../../../features/chat/common/types/chat-concepts.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"

export interface AssembleModelsOptions {
	appId: string
	remote: SystemRemote
	storage: FlexStorage
	authMediator: AuthMediator
	stripePopups: StripePopups
	chatConnect: ChatConnect
}
