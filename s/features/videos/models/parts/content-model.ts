
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"

export function makeContentModel() {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},
	}
}
