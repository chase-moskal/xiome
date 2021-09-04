
import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {AccessLoginExpiredError} from "./errors/access-errors.js"
import {AccessModelOptions} from "./types/access-model-options.js"
import {isTokenValid} from "../../../utils/tokens/is-token-valid.js"
import {happystate} from "../../../../../toolbox/happystate/happystate.js"

export function makeAccessModel({authMediator, loginService}: AccessModelOptions) {
	const happy = happystate({
		state: {
			accessOp: <Op<AccessPayload>>ops.none(),
		},
		actions: state => ({
			setAccessOp(op: Op<AccessPayload>) {
				state.accessOp = op
			}
		}),
	})

	authMediator.subscribeToAccessChange(access => {
		happy.actions.setAccessOp(ops.ready(access))
	})

	async function accessOperation(promise: Promise<AccessPayload>) {
		return ops.operation({
			promise,
			setOp: op => happy.actions.setAccessOp(op),
		})
	}

	const loginFacilities = {
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
				happy.actions.setAccessOp(ops.none())
				await accessOperation(authMediator.initialize())
				throw error
			}
		},
		async logout() {
			await ops.operation({
				promise: authMediator.logout(),
				setOp: op => happy.actions.setAccessOp(op),
			})
		},
		async reauthorize() {
			await accessOperation(authMediator.reauthorize())
		},
	}

	return {
		...happy,
		...loginFacilities,
		getAccessOp() {
			return happy.getState().accessOp
		},
		getAccess() {
			return ops.value(happy.getState().accessOp)
		},
		getValidAccess() {
			return authMediator.getValidAccess()
		},
	}
}
