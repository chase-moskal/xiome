
import {apiOrigin} from "../constants.js"
import {SendEmail} from "../../features/auth/types/send-email.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"

export async function mockConnectPlatform({
		platformHome, tableStorage, sendEmail
	}: {
		platformHome: string
		tableStorage: FlexStorage
		sendEmail: SendEmail
	}) {

	const apiLink = apiOrigin + "/"
	const {backend} = await mockStandardBackend({
		platformHome,
		tableStorage,
		sendEmail,
	})

	const {remote, authGoblin} = await mockWiredRemote({
		apiLink,
		backend,
		tableStorage,
		appWindowLink: platformHome,
		appId: backend.platformAppId,
	})

	return {remote, authGoblin, backend}
}
