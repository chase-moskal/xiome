
import {FlexStorage} from "dbmage"

import {SystemRemote} from "./system-remote.js"
import {StorePopups} from "../../../features/store2/models/types.js"
import {MockStripeOperations} from "../../../features/store2/stripe/types.js"
import {ChatConnect} from "../../../features/chat/common/types/chat-concepts.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"

export interface AssembleModelsOptions {
	appId: string
	remote: SystemRemote
	storePopups: StorePopups
	storage: FlexStorage
	authMediator: AuthMediator
	mockStripeOperations: MockStripeOperations
	chatConnect: ChatConnect
}
