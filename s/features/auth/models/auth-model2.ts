
import {loading} from "../../../toolbox/loading2.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload, LoginToken} from "../auth-types.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"

export function makeAuthModel({authGoblin, loginService}: AuthModelOptions) {
	const state = mobxify({
		accessLoading: loading<AccessPayload>(),
	})

	authGoblin.onAccess(access => {
		state.accessLoading.actions.setReady(access)
	})

	return {
		get accessLoadingView() {
			return state.accessLoading.view
		},

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
						promise: (async() => {
							return await authGoblin.authenticate(
								await loginService.authenticateViaLoginToken({loginToken})
							)
						})(),
						errorReason: "failed to login with token",
					})
				else
					state.accessLoading.actions.setError("login link expired")
			}
			catch (error) {
				state.accessLoading.actions.setError("error with login")
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
