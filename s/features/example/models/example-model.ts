
import {Op} from "../../../framework/ops.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"

export function makeExampleModel({getAccessOp}: {
		getAccessOp: () => Op<AccessPayload>
	}) {

	const happy = happystate({
		state: {
			accessOp: <Op<AccessPayload>>getAccessOp(),
		},
		actions: state => ({
			setAccessOp(op: Op<AccessPayload>) {
				state.accessOp = op
			},
		}),
	})

	return {
		...happy,
		updateAccessOp: (op: Op<AccessPayload>) => {
			happy.actions.setAccessOp(op)
		},
	}
}
