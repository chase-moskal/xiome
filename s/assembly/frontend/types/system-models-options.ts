
import {SystemRemote} from "./system-remote.js"
import {ModalSystem} from "../modal/types/modal-system.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {SystemPopups} from "../connect/system-popups/types/system-popups.js"

export interface AssembleModelsOptions {
	modals: ModalSystem
	remote: SystemRemote
	authGoblin: AuthGoblin
	popups: SystemPopups
}
