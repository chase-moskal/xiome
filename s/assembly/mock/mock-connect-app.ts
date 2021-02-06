
import {apiOrigin} from "../constants.js"
import {SendEmail} from "../../features/auth/auth-types.js"
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import { makeEmailController } from "./common/email-controller.js"

export async function mockConnectApp({
		platformHome, tableStorage, sendEmail
	}: {
		platformHome: string
		tableStorage: SimpleStorage
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

	const appToken = await mockRegisterApp({
		apiLink,
		backend,
	})

	emailController.enableEmails()

	const {remote, authGoblin} = await mockWiredRemote({
		apiLink,
		backend,
		appToken,
		platformHome,
		tableStorage,
	})

	return {remote, authGoblin, backend}
}
