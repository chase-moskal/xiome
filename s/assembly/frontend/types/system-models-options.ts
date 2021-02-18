
import {SystemRemote} from "./system-remote.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"
import {ModalSystem} from "../modal/types/modal-system.js"

export interface AssembleModelsOptions {
	modals: ModalSystem
	remote: SystemRemote
	authGoblin: AuthGoblin
}
