
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {LivestreamShow} from "../api/types/livestream-tables.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {LivestreamRights} from "../components/types/livestream-rights.js"
import {makeLivestreamViewingService} from "../api/services/livestream-viewing-service.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
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

	const happy = happystate({
		state: {
			access: <Op<AccessPayload>>ops.none(),
			shows: <{[label: string]: Op<LivestreamShow>}>{},
		},
		actions: state => ({
			setAccess(op: Op<AccessPayload>) {
				state.access = op
			},
			setShow(label: string, show: Op<LivestreamShow>) {
				state.shows = {
					...state.shows,
					[label]: show,
				}
			},
			clearShows() {
				state.shows = {}
			},
		}),
	})

	function getShow(label: string) {
		return happy.getState().shows[label]
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

	async function loadShow(label: string) {
		if (getRights() !== LivestreamRights.Forbidden)
			ops.operation({
				promise: livestreamViewingService.getShows({labels: [label]}).then(shows => shows[0]),
				setOp: op => happy.actions.setShow(label, op),
			})
		else
			happy.actions.clearShows()
	}

	async function refreshAllShows() {
		if (getRights() !== LivestreamRights.Forbidden) {
			const labels = Object.keys(happy.getState().shows)
			ops.operation({
				promise: livestreamViewingService.getShows({labels}),
				setOp: op => {
					labels.forEach((label, index) => {
						const show = ops.isReady(op)
							? ops.value(op)[index]
							: undefined
						happy.actions.setShow(label, ops.replaceValue(op, show))
					})
				},
			})
		}
		else
			happy.actions.clearShows()
	}

	return {
		...happy,
		getShow,
		getRights,
		loadShow: debounce3(200, loadShow),
		async updateAccessOp(op: Op<AccessPayload>) {
			happy.actions.setAccess(op)
			await refreshAllShows()
		},
	}
}
