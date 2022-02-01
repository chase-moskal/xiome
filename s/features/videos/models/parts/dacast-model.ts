
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {subbies} from "../../../../toolbox/subbies.js"
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {videoPrivileges} from "../../api/video-privileges.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {VideoModelsOptions} from "../types/video-models-options.js"

export function makeDacastModel({dacastService}: VideoModelsOptions) {

	const linkChange = subbies<DacastLinkDisplay | undefined>()
	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		linkedAccountOp: ops.none() as Op<undefined | DacastLinkDisplay>,
	})

	let alreadyInitialized = false

	const isModerator = () => {
		const access = ops.value(state.readable.accessOp)
		return access && access.permit.privileges.includes(
			videoPrivileges["moderate videos"]
		)
	}

	async function loadLinkedAccount() {
		return ops.operation({
			promise: dacastService.getLink(),
			setOp: op => state.writable.linkedAccountOp = op,
		})
	}

	async function refresh() {
		if (alreadyInitialized && isModerator()) {
			await loadLinkedAccount()
		}
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		onLinkChange: linkChange.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.linkedAccountOp = ops.none()
			await refresh()
		},

		async initialize() {
			if (!alreadyInitialized) {
				alreadyInitialized = true
				await refresh()
			}
		},

		get linkedAccount() {
			return ops.value(state.readable.linkedAccountOp)
		},

		async linkAccount({apiKey}: {apiKey: string}) {
			return ops.operation({
				setOp: op => state.writable.linkedAccountOp = op,
				promise: dacastService.setLink({apiKey})
					.then(link => {
						linkChange.publish(link)
						return link
					}),
			})
		},

		async unlinkAccount() {
			return ops.operation({
				setOp: op => state.writable.linkedAccountOp = <Op<undefined>>op,
				promise: dacastService.clearLink()
					.then(() => linkChange.publish(undefined)),
			})
		},
	}
}
