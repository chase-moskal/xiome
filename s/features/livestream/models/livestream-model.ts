
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
		getAccess,
	}: {
		livestreamViewingService: Service<typeof makeLivestreamViewingService>
		livestreamModerationService: Service<typeof makeLivestreamModerationService>
		getAccess: () => Op<AccessPayload>
	}) {

	const happy = happystate({
		state: {
			shows: <{[label: string]: LivestreamShow}>{},
		},
		actions: state => ({
			setShows(...shows: LivestreamShow[]) {
				const merged = {...state.shows}
				for (const show of shows)
					merged[show.label] = show
				state.shows = merged
			},
			clearShows() {
				state.shows = {}
			},
		}),
	})

	function getRights(): LivestreamRights {
		const access = ops.value(getAccess())
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

	function getShow(label: string) {
		return happy.getState().shows[label] ?? {label, vimeoId: null}
	}

	async function refreshShow(label: string) {
		if (getRights() !== LivestreamRights.Forbidden)
			happy.actions.setShows(
				...await livestreamViewingService.getShows({
					labels: [label],
				})
			)
		else
			happy.actions.clearShows()
	}

	async function refreshAllShows() {
		if (getRights() !== LivestreamRights.Forbidden)
			happy.actions.setShows(
				...await livestreamViewingService.getShows({
					labels: Object.keys(happy.getState().shows),
				})
			)
		else
			happy.actions.clearShows()
	}

	return {
		...happy,
		getAccess,
		getShow,
		getRights,
		refreshShow: debounce3(200, refreshShow),
		accessChange: async(access: AccessPayload) => {
			await refreshAllShows()
		}
	}
}
