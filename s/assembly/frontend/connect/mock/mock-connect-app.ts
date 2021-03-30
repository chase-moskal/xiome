
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {makeEmailController} from "./common/email-controller.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import {SendEmail} from "../../../../features/auth/types/emails/send-email.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockConnectApp({
		origins, platformHome, appWindowLink, tableStorage, mockStateStorage,
		sendEmail,
	}: {
		origins: string[]
		platformHome: string
		appWindowLink: string
		tableStorage: FlexStorage
		mockStateStorage: FlexStorage
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

	const ownerEmail = "creative@xiome.io"
	let appId = await mockStateStorage.read<string>("mock-app")
	if (!appId) {
		appId = await mockRegisterApp({
			apiLink,
			backend,
			ownerEmail,
			appOrigins: origins,
		})
		await mockStateStorage.write<string>("mock-app", appId)
		// TODO mock app initialization (link bank!)
	}
	console.log(`mock: app owner email "${ownerEmail}"`)

	emailController.enableEmails()

	const {remote, authGoblin} = await mockWiredRemote({
		appId,
		apiLink,
		backend,
		tableStorage,
		appWindowLink,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {remote, authGoblin, backend, popups}
}
