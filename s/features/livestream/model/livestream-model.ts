
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {LivestreamShow} from "../api/types/livestream-tables.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {makeLivestreamViewingService} from "../api/services/livestream-viewing-service.js"
import {makeLivestreamModerationService} from "../api/services/livestream-moderation-service.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

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

	const getPermissions = () => {
		const access = ops.value(getAccess())
		return {
			canView: access
				? access.permit.privileges.includes(appPermissions.privileges["view livestream"])
				: false,
			canModerate: access
				? access.permit.privileges.includes(appPermissions.privileges["moderate livestream"])
				: false,
		}
	}

	function getShow(label: string) {
		return happy.getState().shows[label] ?? {label, vimeoId: null}
	}

	async function refresh(label: string) {
		happy.actions.setShows(
			...await livestreamViewingService.getShows({
				labels: [label],
			})
		)
	}

	async function refreshAll() {
		const permissions = getPermissions()
		if (permissions.canView) {
			happy.actions.setShows(
				...await livestreamViewingService.getShows({
					labels: Object.keys(happy.getState().shows),
				})
			)
		}
		else {
			happy.actions.clearShows()
		}
	}

	return {
		...happy,
		getAccess,
		getShow,
		refresh: debounce3(200, refresh),
		accessChange: async(access: AccessPayload) => {
			await refreshAll()
		}
	}
}
