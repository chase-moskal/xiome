
import {Op, ops} from "../../../../framework/ops.js"
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"
import {VideoModelsOptions} from "../types/video-models-options.js"

export function makeDacastModel({dacastService}: VideoModelsOptions) {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
		linkedAccountOp: undefined as Op<undefined | DacastLinkDisplay>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},

		get linkedAccount() {
			return ops.value(state.readable.linkedAccountOp)
		},

		async getLinkedAccount() {
			return ops.operation({
				promise: dacastService.getLink(),
				setOp: op => state.writable.linkedAccountOp = op,
			})
		},

		async linkAccount({apiKey}: {apiKey: string}) {
			return ops.operation({
				promise: dacastService.setLink({apiKey}),
				setOp: op => state.writable.linkedAccountOp = op
			})
		},

		async unlinkAccount() {
			return ops.operation({
				promise: dacastService.clearLink(),
				setOp: op => state.writable.linkedAccountOp = <Op<undefined>>op,
			})
		},
	}
}
