
import {snapstate} from "@chasemoskal/snapstate"

import {Op} from "../../../framework/ops.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"

export function makeExampleModel({getAccessOp}: {
		getAccessOp: () => Op<AccessPayload>
	}) {

	const state = snapstate({
		accessOp: <Op<AccessPayload>>getAccessOp(),
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp: (op: Op<AccessPayload>) => {
			state.writable.accessOp = op
		},
	}
}
