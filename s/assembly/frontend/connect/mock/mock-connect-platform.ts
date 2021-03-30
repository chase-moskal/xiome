
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import {SendEmail} from "../../../../features/auth/types/emails/send-email.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockConnectPlatform({
		platformHome, storage, sendEmail
	}: {
		platformHome: string
		storage: FlexStorage
		sendEmail: SendEmail
	}) {

	const apiLink = apiOrigin + "/"
	const {backend} = await mockStandardBackend({
		platformHome,
		tableStorage: storage,
		sendEmail,
	})

	const {remote, authGoblin} = await mockWiredRemote({
		apiLink,
		backend,
		storage,
		appWindowLink: platformHome,
		appId: backend.platformAppId,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {remote, authGoblin, backend, popups}
}
