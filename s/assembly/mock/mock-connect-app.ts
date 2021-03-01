
import {apiOrigin} from "../constants.js"
import {SendEmail} from "../../features/auth/types/send-email.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {makeEmailController} from "./common/email-controller.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"

export async function mockConnectApp({
		origins, platformHome, appWindowLink, tableStorage, sendEmail
	}: {
		origins: string[]
		platformHome: string
		appWindowLink: string
		tableStorage: FlexStorage
		sendEmail: SendEmail
	}) {

	const emailController = makeEmailController(sendEmail)
	emailController.disableEmails()

	const apiLink = apiOrigin + "/"
	const {backend} = await mockStandardBackend({
		platformHome,
		tableStorage,
		sendEmail: emailController.sendEmail,
	})

	const appId = await mockRegisterApp({
		apiLink,
		backend,
		appOrigins: origins,
	})

	emailController.enableEmails()

	const {remote, authGoblin} = await mockWiredRemote({
		appId,
		apiLink,
		backend,
		tableStorage,
		appWindowLink,
	})

	return {remote, authGoblin, backend}
}
