
import {getRando} from "../../toolbox/get-rando.js"
import {mockBackend} from "../backend/mock-backend.js"
import {SendEmail} from "../../features/auth/auth-types.js"
import {mockRemote} from "../frontend/mocks/mock-remote.js"
import {makeTokenStore2} from "../../features/auth/goblin/token-store2.js"
import {prepareSendLoginEmail} from "../../features/auth/tools/emails/send-login-email.js"
import {standardNicknameGenerator} from "../../features/auth/tools/nicknames/standard-nickname-generator.js"

export async function mockBackendAndRemote({
		apiOrigin,
		platformHome,
		platformLabel,
		technicianEmail,
		sendEmail,
	}: {
		apiOrigin: string
		platformHome: string
		platformLabel: string
		technicianEmail: string
		sendEmail: SendEmail
	}) {

	const rando = await getRando()
	const backend = await mockBackend({
		rando,
		platformHome,
		platformLabel,
		technicianEmail,
		tableStorage: window.localStorage,
		sendLoginEmail: prepareSendLoginEmail({sendEmail}),
		generateNickname: standardNicknameGenerator({rando}),
	})

	const channel = new BroadcastChannel("tokenChangeEvent")
	const {remote, authGoblin} = mockRemote({
		api: backend.api,
		apiLink: apiOrigin + "/",
		origin: window.location.origin,
		appToken: backend.platformAppToken,
		latency: {
			min: 200,
			max: 800,
		},
		tokenStore: makeTokenStore2({
			storage: window.localStorage,
			publishTokenChange: () => channel.postMessage(undefined),
		}),
	})
	channel.onmessage = authGoblin.refreshFromStorage

	return {remote, authGoblin, backend}
}
