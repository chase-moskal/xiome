
import {pub} from "../../../../../toolbox/pub.js"
import {clone} from "../../../../../toolbox/clone.js"
import {Op, ops} from "../../../../../framework/ops.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {AccessLoginExpiredError} from "./errors/access-errors.js"
import {AccessModelOptions} from "./types/access-model-options.js"
import {isTokenValid} from "../../../utils/tokens/is-token-valid.js"

export function makeAccessModel({authMediator, loginService}: AccessModelOptions) {
	let accessOp: Op<AccessPayload> = ops.none()
	const accessOpEvent = pub<(accessOp: Op<AccessPayload>) => void | Promise<void>>()

	async function setAccessOp(op: Op<AccessPayload>) {
		accessOp = op
		await accessOpEvent.publish(op)
	}

	authMediator.subscribeToAccessChange(
		async access => setAccessOp(ops.ready(access))
	)

	async function accessOperation(promise: Promise<AccessPayload>) {
		return ops.operation({
			promise,
			setOp: setAccessOp,
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
				await setAccessOp(ops.none())
				await accessOperation(authMediator.initialize())
				throw error
			}
		},
		async logout() {
			await accessOperation(authMediator.logout())
			await ops.operation({
				promise: authMediator.logout(),
				setOp: setAccessOp,
			})
		},
		async reauthorize() {
			await accessOperation(authMediator.reauthorize())
		},
	}

	return {
		...loginFacilities,
		subscribe: accessOpEvent.subscribe,
		getAccessOp() {
			return clone(accessOp)
		},
		getAccess() {
			return ops.value(clone(accessOp))
		},
		getValidAccess() {
			return authMediator.getValidAccess()
		},
	}
}
