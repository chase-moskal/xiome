
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {makeEmailEnabler} from "./common/email-enabler.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import {SendEmail} from "../../../../features/auth/types/emails/send-email.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockConnectApp({
		origins, storage, platformHome, appWindowLink,
		sendEmail,
	}: {
		origins: string[]
		storage: FlexStorage
		platformHome: string
		appWindowLink: string
		sendEmail: SendEmail
	}) {

	const emailEnabler = makeEmailEnabler(sendEmail)
	emailEnabler.disableEmails()

	const apiLink = apiOrigin + "/"
	const {backend} = await mockStandardBackend({
		platformHome,
		tableStorage: storage,
		sendEmail: emailEnabler.sendEmail,
	})

	const ownerEmail = "creative@xiome.io"
	let appId = await storage.read<string>("mock-app")
	if (!appId) {
		appId = await mockRegisterApp({
			apiLink,
			backend,
			ownerEmail,
			appOrigins: origins,
		})
		await storage.write<string>("mock-app", appId)
	}
	console.log(`mock: app owner email "${ownerEmail}"`)

	emailEnabler.enableEmails()

	const {remote, authMediator} = await mockWiredRemote({
		appId,
		apiLink,
		backend,
		storage,
		appWindowLink,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {appId, remote, authMediator, backend, popups}
}
