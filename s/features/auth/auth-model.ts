
import {observable, computed, action} from "mobx"
import * as loading from "../../toolbox/loading.js"
import {TokenStoreTopic, AccessToken, DecodeAccessToken, TriggerAccountPopup, AuthContext, AuthPayload} from "./auth-types.js"

export class AuthModel {
	private readonly expiryGraceTime: number
	private readonly tokenStore: TokenStoreTopic
	private readonly decodeAccessToken: DecodeAccessToken
	private readonly triggerAccountPopup: TriggerAccountPopup

	private authContext: AuthContext

	constructor(options: {
				expiryGraceTime: number
				tokenStore: TokenStoreTopic
				decodeAccessToken: DecodeAccessToken
				triggerAccountPopup: TriggerAccountPopup
			}) {
		this.tokenStore = options.tokenStore
		this.expiryGraceTime = options.expiryGraceTime
		this.decodeAccessToken = options.decodeAccessToken
		this.triggerAccountPopup = options.triggerAccountPopup
	}

	@observable authLoad = loading.load<AuthPayload>()

	@computed get user() {
		return loading.payload(this.authLoad)?.user
	}

	@computed get getAuthContext() {
		return loading.payload(this.authLoad)?.getAuthContext
	}

	@action.bound
	async useExistingLogin() {
		this.setLoading()
		try {
			const accessToken = await this.tokenStore.passiveCheck()
			if (accessToken) {
				const detail = this.processAccessToken(accessToken)
				this.setLoggedIn(detail)
			}
			else this.setLoggedOut()
		}
		catch (error) {
			this.setError(error)
		}
	}

	 @action.bound
	async loginWithAccessToken(accessToken: AccessToken) {
		await this.tokenStore.writeAccessToken(accessToken)
		if (accessToken) {
			const payload = this.processAccessToken(accessToken)
			this.setLoggedIn(payload)
		}
		else {
			this.setLoggedOut()
		}
	}

	 @action.bound
	async login() {
		this.setLoading()
		try {
			const authTokens = await this.triggerAccountPopup()
			await this.tokenStore.writeTokens(authTokens)
			const payload = this.processAccessToken(authTokens.accessToken)
			this.setLoggedIn(payload)
		}
		catch (error) {
			console.error(error)
		}
	}

	 @action.bound
	async logout() {
		this.setLoading()
		try {
			await this.tokenStore.clearTokens()
			this.authContext = null
			this.setLoggedOut()
		}
		catch (error) {
			this.setError(error)
		}
	}

	 @action.bound
	async reauthorize() {
		this.setLoading()
		try {
			await this.tokenStore.writeAccessToken(null)
			this.authContext = null
			await this.useExistingLogin()
		}
		catch (error) {
			this.setError(error)
		}
	}

	//
	// private methods
	//

	 @action.bound
	private processAccessToken(accessToken: AccessToken): AuthPayload {
		this.authContext = this.decodeAccessToken(accessToken)
		const getAuthContext = async() => {
			const expiry = this.authContext.exp * 1000
			const expired = Date.now() > (expiry - this.expiryGraceTime)
			if (expired) {
				await this.reauthorize()
			}
			return this.authContext
		}
		return {getAuthContext, user: this.authContext.user}
	}

	 @action.bound
	private setError(error: Error) {
		this.authLoad = loading.error(undefined)
		console.error(error)
	}

	 @action.bound
	private setLoading() {
		this.authLoad = loading.loading()
	}

	 @action.bound
	private setLoggedIn({user, getAuthContext}: AuthPayload) {
		this.authLoad = loading.ready({user, getAuthContext})
	}

	 @action.bound
	private setLoggedOut() {
		this.authLoad = loading.ready({user: null, getAuthContext: null})
	}
}
