
import {Op, ops} from "../../../framework/ops.js"
import {LoginToken} from "../types/tokens/login-token.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {AuthModelOptions} from "./types/auth/auth-model-options.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"

export function makeAuthModel({authMediator, loginService}: AuthModelOptions) {

	const auto = autowatcher()
	const state = auto.state({
		access: <Op<AccessPayload>>ops.none(),
	})
	const actions = auto.actions({
		setAccess(op: Op<AccessPayload>) {
			state.access = op
		},
	})

	authMediator.subscribeToAccessChange(access => {
		actions.setAccess(ops.ready(access))
	})

	async function accessOperation(promise: Promise<AccessPayload>) {
		return ops.operation({
			promise,
			setOp: op => actions.setAccess(op),
		})
	}

	return {
		track: auto.track,

		get access() {
			return state.access
		},

		onAccessChange: authMediator.subscribeToAccessChange,

		async getValidAccess(): Promise<AccessPayload> {
			return authMediator.getAccess()
		},

		async useExistingLogin() {
			await accessOperation(authMediator.initialize())
		},

		async sendLoginLink(email: string) {
			return loginService.sendLoginLink({email})
		},

		async login(loginToken: LoginToken) {
			try {
				if (isTokenValid(loginToken))
					await accessOperation(
						loginService
							.authenticateViaLoginToken({loginToken})
							.then(tokens => authMediator.login(tokens))
					)
				else
					actions.setAccess(ops.error("login link expired"))
			}
			catch (error) {
				console.error(error)
				actions.setAccess(ops.error("error with login"))
			}
		},

		async logout() {
			await ops.operation({
				promise: authMediator.logout(),
				setOp: op => actions.setAccess(op),
			})
		},

		async reauthorize() {
			await accessOperation(authMediator.reauthorize())
		},
	}
}
