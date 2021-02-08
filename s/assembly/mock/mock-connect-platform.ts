
import {apiOrigin} from "../constants.js"
import {SendEmail} from "../../features/auth/auth-types.js"
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockStandardBackend} from "./common/mock-standard-backend.js"

export async function mockConnectPlatform({
		platformHome, tableStorage, sendEmail
	}: {
		platformHome: string
		tableStorage: SimpleStorage
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
