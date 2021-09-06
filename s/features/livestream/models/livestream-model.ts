
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {LivestreamRights} from "./types/livestream-rights.js"
import {madstate} from "../../../toolbox/madstate/madstate.js"
import {LivestreamShow} from "../api/types/livestream-tables.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {makeLivestreamViewingService} from "../api/services/livestream-viewing-service.js"
import {makeLivestreamModerationService} from "../api/services/livestream-moderation-service.js"

export function makeLivestreamModel({
		livestreamViewingService,
		livestreamModerationService,
		getAccessOp,
	}: {
		livestreamViewingService: Service<typeof makeLivestreamViewingService>
		livestreamModerationService: Service<typeof makeLivestreamModerationService>
		getAccessOp: () => Op<AccessPayload>
	}) {

	const state = madstate({
		accessOp: <Op<AccessPayload>>ops.none(),
		shows: <{[label: string]: Op<LivestreamShow>}>{},
	})

	const stateActions = {
		addShow(label: string, show: Op<LivestreamShow>) {
			state.writable.shows = {
				...state.writable.shows,
				[label]: show,
			}
		},
	}

	function getShow(label: string): Op<LivestreamShow> {
		return state.readable.shows[label]
			?? ops.ready({label, vimeoId: null})
	}

	function getRights(): LivestreamRights {
		const access = ops.value(getAccessOp())
		const canView = access
			? access.permit.privileges.includes(appPermissions.privileges["view livestream"])
			: false
		const canModerate = access
			? access.permit.privileges.includes(appPermissions.privileges["moderate livestream"])
			: false
		return canModerate
			? LivestreamRights.Moderator
			: canView
				? LivestreamRights.Viewer
				: LivestreamRights.Forbidden
	}


	async function commitShow(show: LivestreamShow) {
		return await ops.operation({
			promise: livestreamModerationService.setShow(show)
				.then(() => show),
			setOp: op => stateActions.addShow(show.label, op)
		})
	}

	async function loadShow(label: string) {
		if (getRights() !== LivestreamRights.Forbidden)
			await ops.operation({
				promise: livestreamViewingService.getShows({labels: [label]}).then(shows => shows[0]),
				setOp: op => stateActions.addShow(label, op),
			})
		else
			state.writable.shows = {}
	}

	async function refreshAllShows() {
		if (getRights() !== LivestreamRights.Forbidden) {
			const labels = Object.keys(state.readable.shows)
			await ops.operation({
				promise: livestreamViewingService.getShows({labels}),
				setOp: op => {
					labels.forEach((label, index) => {
						const show = ops.isReady(op)
							? ops.value(op)[index]
							: undefined
						stateActions.addShow(label, ops.replaceValue(op, show))
					})
				},
			})
		}
		else
			state.writable.shows = {}
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		getShow,
		getRights,
		commitShow,
		loadShow: debounce3(200, loadShow),
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			await refreshAllShows()
		},
	}
}
