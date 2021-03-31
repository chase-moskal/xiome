
import {SystemRemote} from "./system-remote.js"
import {ModalSystem} from "../modal/types/modal-system.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {SystemPopups} from "../connect/system-popups/types/system-popups.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export interface AssembleModelsOptions {
	appId: string
	modals: ModalSystem
	remote: SystemRemote
	authGoblin: AuthGoblin
	popups: SystemPopups
	storage: FlexStorage
}
