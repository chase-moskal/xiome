
import {Op, ops} from "../../../framework/ops.js"
import {AccessPayload} from "../types/auth-tokens.js"
import {happyCombine} from "../../../toolbox/happystate/happy-combine.js"
import {Happy, happystate} from "../../../toolbox/happystate/happystate.js"

export function happyWithAuth<xHappy extends Happy<any, any>>(base: xHappy) {
	const happyAuth = happystate({
		state: {
			accessOp: <Op<AccessPayload>>ops.none()
		},
		actions: state => ({
			setAccessOp(op: Op<AccessPayload>) {
				state.accessOp = op
			},
		}),
	})

	const happy = happyCombine(base)(happyAuth).combine()

	return {
		happy,
		updateAccessOp(op: Op<AccessPayload>) {
			happy.actions.setAccessOp(op)
		},
	}
	return 
}
