
import {loading} from "../../../toolbox/loading2.js"
import {mobxify} from "../../../framework/mobxify.js"

import {AccessPayload, LoginToken} from "../auth-types.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"

export function makeAuthModel({authGoblin, loginService}: AuthModelOptions) {
	const state = mobxify({
		access: loading<AccessPayload>(),
	})

	authGoblin.onAccess(access => {
		state.access.actions.setReady(access)
	})

	async function tryOrReportAccessError(func: () => any) {
		try {
			return func()
		}
		catch (error) {
			state.access.actions.setError("auth error")
			console.error(error)
		}
	}

	return {
		getAccessLoadingView() {
			return state.access.view
		},

		async getValidAccess(): Promise<AccessPayload> {
			return authGoblin.getAccess()
		},

		async useExistingLogin() {
			state.access.actions.setLoading()
			await tryOrReportAccessError(async() => {
				state.access.actions.setReady(await authGoblin.getAccess())
			})
		},

		async sendLoginLink(email: string) {
			await loginService.sendLoginLink({email})
		},

		async login(loginToken: LoginToken) {
			await tryOrReportAccessError(async() => {
				await authGoblin.authenticate(
					await loginService.authenticateViaLoginToken({loginToken})
				)
			})
		},

		async logout() {
			await authGoblin.clearAuth()
		},

		async reauthorize() {
			await tryOrReportAccessError(async() => {
				await authGoblin.reauthorize()
			})
		},
	}
}
