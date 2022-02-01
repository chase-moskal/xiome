
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {AccessLoginExpiredError} from "./errors/access-errors.js"
import {AccessModelOptions} from "./types/access-model-options.js"
import {isTokenValid} from "../../../utils/tokens/is-token-valid.js"

export function makeAccessModel({authMediator, loginService}: AccessModelOptions) {

	const state = snapstate({
		accessOp: <Op<AccessPayload>>ops.none(),
	})

	authMediator.subscribeToAccessChange(access => {
		state.writable.accessOp = ops.ready(access)
	})

	async function accessOperation(promise: Promise<AccessPayload>) {
		return ops.operation({
			promise,
			setOp: op => state.writable.accessOp = op,
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
				state.writable.accessOp = ops.none()
				await accessOperation(authMediator.initialize())
				throw error
			}
		},
		async logout() {
			await ops.operation({
				promise: authMediator.logout(),
				setOp: op => state.writable.accessOp = op,
			})
		},
		async reauthorize() {
			await accessOperation(authMediator.reauthorize())
		},
	}

	return {
		readable: state.readable,
		track: state.track,
		subscribe: state.subscribe,
		...loginFacilities,
		getAccessOp() {
			return state.readable.accessOp
		},
		getAccess() {
			return ops.value(state.readable.accessOp)
		},
		getValidAccess() {
			return authMediator.getValidAccess()
		},
	}
}
