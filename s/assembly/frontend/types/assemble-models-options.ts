
import {SystemRemote} from "./system-remote.js"
import {ModalSystem} from "../modal/types/modal-system.js"
import {SystemPopups} from "../connect/system-popups/types/system-popups.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {AuthMediator} from "../../../features/auth/mediator/types/auth-mediator.js"

export interface AssembleModelsOptions {
	appId: string
	remote: SystemRemote
	popups: SystemPopups
	storage: FlexStorage
	authMediator: AuthMediator
}
