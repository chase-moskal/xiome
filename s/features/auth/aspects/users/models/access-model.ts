
import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {AccessModelOptions} from "./types/access-model-options.js"
import {isTokenValid} from "../../../utils/tokens/is-token-valid.js"
import {autowatcher} from "../../../../../toolbox/autowatcher/autowatcher.js"
import {AccessLoginExpiredError} from "./errors/access-errors.js"

export function makeAccessModel({authMediator, loginService}: AccessModelOptions) {
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

		async login(loginToken: string) {
			try {
				if (isTokenValid(loginToken)) 
					await accessOperation(
						loginService
							.authenticateViaLoginToken({loginToken})
							.then(tokens => authMediator.login(tokens))
					)
				else
					throw new AccessLoginExpiredError()
			}
			catch (error) {
				console.error(error)
				actions.setAccess(ops.none())
				await accessOperation(authMediator.initialize())
				throw error
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
