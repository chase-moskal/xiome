
import {loading} from "../../../framework/loading/loading.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload} from "../types/access-payload.js"
import {LoginToken} from "../types/login-token.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"

export function makeAuthModel({authGoblin, loginService}: AuthModelOptions) {
	const state = mobxify({
		accessLoading: loading<AccessPayload>(),
	})

	authGoblin.onAccessChange(access => {
		state.accessLoading.actions.setReady(access)
	})

	return {
		get accessLoadingView() {
			return state.accessLoading.view
		},

		onAccessChange: authGoblin.onAccessChange,

		async getValidAccess(): Promise<AccessPayload> {
			return authGoblin.getAccess()
		},

		async useExistingLogin() {
			await state.accessLoading.actions.setLoadingUntil({
				promise: authGoblin.getAccess(),
				errorReason: "error loading existing login",
			})
		},

		async sendLoginLink(email: string) {
			return await loginService.sendLoginLink({email})
		},

		async login(loginToken: LoginToken) {
			try {
				if (isTokenValid(loginToken))
					await state.accessLoading.actions.setLoadingUntil({
						promise: loginService.authenticateViaLoginToken({loginToken})
							.then(tokens => authGoblin.authenticate(tokens)),
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
			await authGoblin.clearAuth()
		},

		async reauthorize() {
			await state.accessLoading.actions.setLoadingUntil({
				promise: authGoblin.reauthorize(),
				errorReason: "failed to reauthorize",
			})
		},
	}
}
