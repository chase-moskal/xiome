
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {SendLoginEmail} from "../../features/auth/auth-types.js"

export interface MockSystemOptions {
	tableStorage: SimpleStorage
	platformLink: string
	technicianEmail: string
	platformAppLabel: string
	sendLoginEmail: SendLoginEmail
}
