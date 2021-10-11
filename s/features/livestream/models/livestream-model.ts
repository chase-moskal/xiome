
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {debounce} from "../../../toolbox/debounce/debounce.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {LivestreamRights} from "./types/livestream-rights.js"
import {snapstate} from "../../../toolbox/snapstate/snapstate.js"
import {LivestreamShow} from "../api/types/livestream-tables.js"
import {makeLivestreamViewingService} from "../api/services/livestream-viewing-service.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {makeLivestreamModerationService} from "../api/services/livestream-moderation-service.js"
import {objectMap} from "../../../toolbox/object-map.js"

// https://vimeo.com/122311493

export function makeLivestreamModel({
		livestreamViewingService,
		livestreamModerationService,
		getAccessOp,
	}: {
		livestreamViewingService: Service<typeof makeLivestreamViewingService>
		livestreamModerationService: Service<typeof makeLivestreamModerationService>
		getAccessOp: () => Op<AccessPayload>
	}) {

	const state = snapstate({
		rights: LivestreamRights.Forbidden,
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
		clearShows() {
			state.writable.shows = objectMap(state.writable.shows, () => ops.none())
		},
	}

	function getShow(label: string): Op<LivestreamShow> {
		return state.readable.shows[label]
			?? ops.ready({label, vimeoId: null})
	}

	async function commitShow(show: LivestreamShow) {
		return await ops.operation({
			promise: livestreamModerationService.setShow(show)
				.then(() => show),
			setOp: op => stateActions.addShow(show.label, op)
		})
	}

	async function loadShow(label: string) {
		if (state.readable.rights !== LivestreamRights.Forbidden) {
			await ops.operation({
				promise: livestreamViewingService.getShows({labels: [label]})
					.then(shows => shows[0]),
				setOp: op => stateActions.addShow(label, op),
			})
		}
		else {
			stateActions.addShow(label, ops.none())
		}
	}

	async function refreshAllShows() {
		if (state.readable.rights !== LivestreamRights.Forbidden) {
			const labels = Object.keys(state.readable.shows)
			if (labels.length > 0)
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
			stateActions.clearShows()
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		getShow,
		commitShow,
		loadShow: debounce(200, loadShow),
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			{
				const access = ops.value(getAccessOp())
				const permitted = (priv: keyof typeof appPermissions.privileges) =>
					access.permit.privileges.includes(appPermissions.privileges[priv])
				state.writable.rights = !access
					? LivestreamRights.Forbidden
					: permitted("moderate livestream")
						? LivestreamRights.Moderator
						: permitted("view livestream")
							? LivestreamRights.Viewer
							: LivestreamRights.Forbidden
			}
			await refreshAllShows()
		},
	}
}
