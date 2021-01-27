
import {loading} from "../../../toolbox/loading2.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload, LoginToken} from "../auth-types.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"
import { isTokenValid } from "../tools/tokens/is-token-valid.js"

export function makeAuthModel({authGoblin, loginService}: AuthModelOptions) {
	const state = mobxify({
		accessLoading: loading<AccessPayload>(),
	})

	authGoblin.onAccess(access => {
		state.accessLoading.actions.setReady(access)
	})

	return {
		getAccessLoadingView() {
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
			await state.accessLoading.actions.setLoadingUntil({
				promise: loginService.sendLoginLink({email}).then(() => undefined),
				errorReason: "failed to send login link",
			})
		},

		async login(loginToken: LoginToken) {
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
