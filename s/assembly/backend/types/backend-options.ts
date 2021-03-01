
import {Rando} from "../../../toolbox/get-rando.js"
import {SendLoginEmail} from "../../../features/auth/types/send-login-email.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export interface BackendOptions {
	rando: Rando
	platformHome: string
	platformLabel: string
	technicianEmail: string
	tableStorage: FlexStorage
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
