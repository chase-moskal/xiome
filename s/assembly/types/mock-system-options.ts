
import {Rando} from "../../toolbox/get-rando.js"
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {SendLoginEmail} from "../../features/auth/auth-types.js"

export interface MockSystemOptions {
	rando: Rando
	platformHome: string
	platformLabel: string
	technicianEmail: string
	tableStorage: SimpleStorage
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
