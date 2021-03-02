
import {SystemRemote} from "./system-remote.js"
import {ModalSystem} from "../modal/types/modal-system.js"
import {AuthGoblin} from "../../../features/auth/goblin/types/auth-goblin.js"

export interface AssembleModelsOptions {
	modals: ModalSystem
	remote: SystemRemote
	authGoblin: AuthGoblin
}
