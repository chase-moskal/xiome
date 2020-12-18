
import {observable, computed, action} from "mobx"

import {GetApi} from "../../../types.js"
import * as loading from "../../../toolbox/loading.js"
import {mixinModelMobx} from "../../../framework/mixin-model-mobx.js"
import {TokenStoreTopic, AccessToken, DecodeAccessToken, TriggerAccountPopup, AuthContext, AuthPayload, AuthApi} from "../auth-types.js"
import { isTokenTimingExpired } from "../tools/is-token-timing-expired.js"

 @mixinModelMobx
export class AuthModel {
	private readonly tokenStore: TokenStoreTopic
	private readonly decodeAccessToken: DecodeAccessToken
	private readonly triggerAccountPopup: TriggerAccountPopup

	private authContext: AuthContext

	constructor(options: {
				tokenStore: TokenStoreTopic
				getAuthApi: GetApi<AuthApi>
				decodeAccessToken: DecodeAccessToken
				triggerAccountPopup: TriggerAccountPopup
			}) {
		this.tokenStore = options.tokenStore
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
			if (isTokenTimingExpired(this.authContext.exp)) await this.reauthorize()
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
	private setLoggedIn(authPayload: AuthPayload) {
		this.authLoad = loading.ready(authPayload)
	}

	 @action.bound
	private setLoggedOut() {
		this.authLoad = loading.ready({user: null, getAuthContext: null})
	}
}
