
import {loginTopic} from "../topics/login-topic.js"
import {mobxify} from "../../../framework/mobxify.js"
import * as loading from "../../../toolbox/loading.js"

import {Service} from "../../../types/service.js"
import {AccessPayload, LoginToken} from "../auth-types.js"
import {AuthGoblin} from "../../../assembly/types/frontend/auth-goblin/auth-goblin.js"

export function makeAuthModel2({authGoblin, loginService}: {
		authGoblin: AuthGoblin
		loginService: Service<typeof loginTopic>
	}) {

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
