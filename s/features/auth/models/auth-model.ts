
import {mobxify} from "../../../framework/mobxify.js"
import * as loading from "../../../toolbox/loading.js"

import {AccessPayload, LoginToken} from "../auth-types.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"

export function makeAuthModel({authGoblin, loginService}: AuthModelOptions) {

	const state = mobxify(new class {
		accessLoad = loading.load<AccessPayload>()
		setError(error: Error) {
			this.accessLoad = loading.error(undefined)
			console.error(error)
		}
		setLoading() {
			this.accessLoad = loading.loading()
		}
		setAccess(access: AccessPayload) {
			this.accessLoad = loading.ready(access)
		}
	})

	authGoblin.onAccess(access => {
		state.setAccess(access)
	})

	return new class {
		getAccessLoad() {
			return state.accessLoad
		}
		async getAccess(): Promise<AccessPayload> {
			return authGoblin.getAccess()
		}
		async useExistingLogin() {
			state.setLoading()
			try { state.setAccess(await authGoblin.getAccess()) }
			catch (error) { state.setError(error) }
		}
		async sendLoginLink(email: string) {
			try { await loginService.sendLoginLink({email}) }
			catch (error) { state.setError(error) }
		}
		async login(loginToken: LoginToken) {
			try {
				await authGoblin.authenticate(
					await loginService.authenticateViaLoginToken({loginToken})
				)
			}
			catch (error) { state.setError(error) }
		}
		async logout() {
			await authGoblin.clearAuth()
		}
		async reauthorize() {
			try {
				await authGoblin.reauthorize()
				state.setAccess(await authGoblin.getAccess())
			}
			catch (error) { state.setError(error) }
		}
	}
}
