
import {Rando} from "../../../toolbox/get-rando.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {SendLoginEmail} from "../../../features/auth/types/emails/send-login-email.js"

export interface BackendOptions {
	rando: Rando
	platformHome: string
	platformLabel: string
	technicianEmail: string
	tableStorage: FlexStorage
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
