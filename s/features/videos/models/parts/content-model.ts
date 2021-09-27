
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"
import {VideoModelsOptions} from "../types/video-models-options.js"
import {VideoHosting, VideoShow, VideoView} from "../../types/video-concepts.js"
import {videoPrivileges} from "../../api/video-privileges.js"

export function makeContentModel({contentService}: VideoModelsOptions) {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
		catalogOp: ops.none() as Op<VideoHosting.AnyContent[]>,
		viewsOp: ops.none() as Op<VideoView[]>,
		showsOp: ops.none() as Op<VideoShow[]>,
	})

	async function loadModerationData() {
		const access = ops.value(state.readable.accessOp)
		const isModerator = access && access.permit
			.privileges.includes(videoPrivileges["moderate videos"])
		if (isModerator) {
			await Promise.all([
				ops.operation({
					promise: contentService.fetchCatalog(),
					setOp: op => state.writable.catalogOp = op,
				}),
				ops.operation({
					promise: contentService.getViews(),
					setOp: op => state.writable.viewsOp = op,
				}),
			])
		}
	}

	async function loadShow(label: string) {
		const oldShows = ops.value(state.readable.showsOp) ?? []
		let updatedShow: VideoShow
		await ops.operation({
			setOp: op => state.writable.showsOp = op,
			promise: contentService.getShows({labels: [label]})
				.then(shows => shows[0])
				.then(show => updatedShow = show)
				.then(show => [
					...oldShows.filter(s => s.label !== label),
					...(show ? [show] : []),
				]),
		})
		return updatedShow
	}

	async function refreshShows() {
		const oldShows = ops.value(state.readable.showsOp) ?? []
		const labels = oldShows.map(s => s.label)
		if (labels.length)
			await ops.operation({
				setOp: op => state.writable.showsOp = op,
				promise: contentService.getShows({labels})
					.then(shows => shows.filter(s => !!s))
			})
	}

	let alreadyInitialized = false
	async function initialize(label: string) {
		if (!alreadyInitialized) {
			alreadyInitialized = true
			await Promise.all([
				loadShow(label),
				loadModerationData(),
			])
		}
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.catalogOp = ops.none()
			state.writable.viewsOp = ops.none()
			state.writable.showsOp = ops.none()
			await refreshShows()
			await loadModerationData()
		},

		initialize,

		get allowance() {
			const access = ops.value(state.readable.accessOp)
			const can = (p: keyof typeof videoPrivileges) =>
				access
					? access.permit.privileges.includes(videoPrivileges[p])
					: false
			return {
				canModerateVideos: can("moderate videos"),
				canViewAllVideos: can("view all videos"),
			}
		},

		get catalog() {
			return ops.value(state.readable.catalogOp) ?? []
		},

		get views() {
			return ops.value(state.readable.viewsOp) ?? []
		},

		get shows() {
			return ops.value(state.readable.showsOp) ?? []
		},

		getView(label: string) {
			const views = ops.value(state.readable.viewsOp)
			return views
				? views.find(view => view.label === label)
				: undefined
		},

		getShow(label: string) {
			const shows = ops.value(state.readable.showsOp)
			return shows
				? shows.find(show => show.label === label)
				: undefined
		},

		async setView(options: {
				label: string
				privileges: string[]
				reference: VideoHosting.AnyReference
			}) {
			const oldViews = ops.value(state.readable.viewsOp) ?? []
			await ops.operation({
				setOp: op => state.writable.viewsOp = op,
				promise: contentService.writeView(options).then(() => [
					...oldViews.filter(v => v.label !== options.label),
					{
						...options.reference,
						label: options.label,
						privileges: options.privileges,
					},
				]),
			})
			await loadShow(options.label)
		},

		async deleteView(label: string) {
			const oldViews = ops.value(state.readable.viewsOp) ?? []
			await ops.operation({
				setOp: op => state.writable.viewsOp = op,
				promise: contentService.deleteView({label})
					.then(() => oldViews.filter(v => v.label !== label)),
			})
			const oldShows = ops.value(state.readable.showsOp) ?? []
			state.writable.showsOp = ops.replaceValue(
				state.readable.showsOp,
				oldShows.filter(s => s.label !== label),
			)
		},
	}
}
