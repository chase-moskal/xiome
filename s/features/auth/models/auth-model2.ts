
import {loading} from "../../../framework/loading/loading.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload} from "../types/tokens/access-payload.js"
import {LoginToken} from "../types/tokens/login-token.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"

export function makeAuthModel({authMediator, loginService}: AuthModelOptions) {
	const state = mobxify({
		accessLoading: loading<AccessPayload>(),
	})

	authMediator.subscribeToAccessChange(access => {
		state.accessLoading.actions.setReady(access)
	})

	return {
		get accessLoadingView() {
			return state.accessLoading.view
		},

		onAccessChange: authMediator.subscribeToAccessChange,

		async getValidAccess(): Promise<AccessPayload> {
			return authMediator.getAccess()
		},

		async useExistingLogin() {
			return state.accessLoading.actions.setLoadingUntil({
				promise: authMediator.initialize(),
				errorReason: "error loading existing login",
			})
		},

		async sendLoginLink(email: string) {
			return loginService.sendLoginLink({email})
		},

		async login(loginToken: LoginToken) {
			try {
				if (isTokenValid(loginToken))
					await state.accessLoading.actions.setLoadingUntil({
						promise: loginService
							.authenticateViaLoginToken({loginToken})
							.then(tokens => authMediator.login(tokens)),
						errorReason: "failed to login with token",
					})
				else
					state.accessLoading.actions.setError("login link expired")
			}
			catch (error) {
				state.accessLoading.actions.setError("error with login")
				console.error(error)
			}
		},

		async logout() {
			await authMediator.logout()
		},

		async reauthorize() {
			await state.accessLoading.actions.setLoadingUntil({
				promise: authMediator.reauthorize(),
				errorReason: "failed to reauthorize",
			})
		},
	}
}
