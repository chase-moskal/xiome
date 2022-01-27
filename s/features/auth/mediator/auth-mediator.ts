
import {pubsub} from "../../../toolbox/pubsub.js"
import {Service} from "../../../types/service.js"
import {isTokenValid} from "../utils/tokens/is-token-valid.js"
import {AccessPayload, AuthTokens} from "../types/auth-tokens.js"
import {AccessEventListener} from "./types/access-event-listener.js"
import {decodeAccessToken} from "../utils/tokens/decode-access-token.js"
import {makeGreenService} from "../aspects/users/services/green-service.js"
import {FlexStorage} from "dbmage"

export function makeAuthMediator({
		appId,
		storage,
		greenService,
	}: {
		appId: string
		storage: FlexStorage
		greenService: Service<typeof makeGreenService>
	}) {

	const tokenChangeEvent = pubsub<() => void>()
	const accessEvent = pubsub<AccessEventListener>()

	const key = `auth-tokens-${appId}`
	type AccessDetails = {access: AccessPayload; accessToken: string}
	const emptyTokens = () => ({accessToken: undefined, refreshToken: undefined})
	const getTokens = async() => await storage.read<AuthTokens>(key) ?? emptyTokens()
	const setTokens = async(tokens: AuthTokens) => storage.write(key, tokens)

	async function commitTokens(tokens: AuthTokens) {
		const access = decodeAccessToken(tokens.accessToken)
		await setTokens(tokens)
		tokenChangeEvent.publish()
		await accessEvent.publish(access)
		return access
	}

	async function authorize(refreshToken: undefined | string) {
		const accessToken = await greenService.authorize({
			appId,
			refreshToken,
			scope: {core: true},
		})
		const access = await commitTokens({accessToken, refreshToken})
		return {access, accessToken}
	}

	const obtainAccessAndReauthorizeIfNecessary = (
		async(): Promise<AccessDetails> => {
			const {accessToken, refreshToken} = await getTokens()
			return isTokenValid(accessToken)
				? {accessToken, access: decodeAccessToken(accessToken)}
				: isTokenValid(refreshToken)
					? authorize(refreshToken)
					: authorize(undefined)
		}
	)

	return {
		subscribeToAccessChange: accessEvent.subscribe,
		subscribeToTokenChange: tokenChangeEvent.subscribe,
		async initialize() {
			const {access} = await obtainAccessAndReauthorizeIfNecessary()
			await accessEvent.publish(access)
			return access
		},
		async getValidAccess() {
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
		async getValidAccessToken() {
			return (await obtainAccessAndReauthorizeIfNecessary()).accessToken
		},
		async login(tokens: AuthTokens) {
			return commitTokens(tokens)
		},
		async logout() {
			await setTokens(emptyTokens())
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
		async reauthorize(): Promise<AccessPayload> {
			const tokens = await getTokens()
			await setTokens({...tokens, accessToken: undefined})
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
	}
}
