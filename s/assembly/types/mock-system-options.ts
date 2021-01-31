
import {Rando} from "../../toolbox/get-rando.js"
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {SendLoginEmail} from "../../features/auth/auth-types.js"

export interface MockSystemOptions {
	rando: Rando
	tableStorage: SimpleStorage
	platformLink: string
	technicianEmail: string
	platformAppLabel: string
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
