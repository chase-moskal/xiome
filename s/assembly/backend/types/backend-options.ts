
import {Rando} from "dbmage"
import {FlexStorage} from "dbmage"
import {SendLoginEmail} from "../../../features/auth/aspects/users/types/emails/send-login-email.js"

export interface BackendOptions {
	rando: Rando
	platformHome: string
	platformLabel: string
	technicianEmail: string
	tableStorage: FlexStorage
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}
