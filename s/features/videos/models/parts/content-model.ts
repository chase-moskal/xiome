
import {snapstate} from "@chasemoskal/snapstate"

import {Op, ops} from "../../../../framework/ops.js"
import {videoPrivileges} from "../../api/video-privileges.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {VideoModelsOptions} from "../types/video-models-options.js"
import {VideoHosting, VideoShow, VideoView} from "../../types/video-concepts.js"
import {PrivilegeDisplay} from "../../../auth/aspects/users/routines/permissions/types/privilege-display.js"

export function makeContentModel({
		contentService,
	}: VideoModelsOptions) {

	const state = snapstate({
		accessOp: ops.none() as Op<AccessPayload>,
		catalogOp: ops.none() as Op<VideoHosting.AnyContent[]>,
		viewsOp: ops.none() as Op<VideoView[]>,
		privilegesOp: ops.none() as Op<PrivilegeDisplay[]>,
		showsOp: ops.none() as Op<VideoShow[]>,
	})

	const activeShowLabels = new Set<string>()
	const currentlyLoadingShows = new Set<string>()

	function getAccess(): undefined | AccessPayload {
		return ops.value(state.readable.accessOp)
	}

	let initialized = false

	async function loadModerationData() {
		initialized = true
		const access = getAccess()
		const isModerator = access && access.permit
			.privileges.includes(videoPrivileges["moderate videos"])
		if (isModerator) {
			await ops.operation({
				promise: contentService.fetchModerationData(),
				setOp: op => {
					const data = ops.value(op)
					state.writable.catalogOp = ops.replaceValue(
						op,
						data?.catalog ?? [],
					)
					state.writable.viewsOp = ops.replaceValue(
						op,
						data?.views ?? [],
					)
					state.writable.privilegesOp = ops.replaceValue(
						op,
						data?.privileges ?? [],
					)
				},
			})
		}
	}

	async function loadShow(label: string) {
		initialized = true
		activeShowLabels.add(label)
		if (!getAccess() || currentlyLoadingShows.has(label))
			return undefined
		currentlyLoadingShows.add(label)
		const oldShows = ops.value(state.readable.showsOp) ?? []
		let updatedShow: VideoShow
		await ops.operation({
			setOp: op => state.writable.showsOp = op,
			promise: contentService.getShows({labels: [label]})
				.then(shows => shows[0])
				.then(show => updatedShow = show)
				.then(show => [
					...oldShows.filter(s => s.label !== label),
					...(show ? [show] : [{label, details: undefined}]),
				]),
		})
		currentlyLoadingShows.delete(label)
		return updatedShow
	}

	async function refreshShows() {
		initialized = true
		if (!getAccess())
			return undefined
		const labels = Array.from(activeShowLabels)
			.filter(label => !currentlyLoadingShows.has(label))
		if (labels.length) {
			for (const label of labels)
				currentlyLoadingShows.add(label)
			await ops.operation({
				setOp: op => state.writable.showsOp = op,
				promise: contentService.getShows({labels})
					.then(shows => shows.filter(s => !!s))
			})
			for (const label of labels)
				currentlyLoadingShows.delete(label)
		}
	}

	return {
		state: state.readable,
		subscribe: state.subscribe,
		async updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
			state.writable.catalogOp = ops.none()
			state.writable.viewsOp = ops.none()
			if (initialized) {
				await loadModerationData()
				await refreshShows()
			}
		},
		async onVideoHostingUpdate() {
			if (initialized) {
				await loadModerationData()
				await refreshShows()
			}
		},

		async initializeForModerationData() {
			if (!initialized) {
				await loadModerationData()
			}
		},
	
		async initializeForVideo(label: string) {
			if (!initialized)
				await loadModerationData()
			await loadShow(label)
		},

		get allowance() {
			const access = ops.value(state.readable.accessOp)
			const can = (p: keyof typeof videoPrivileges) =>
				access
					? access.permit.privileges.includes(videoPrivileges[p])
					: false
			return {
				canModerateVideos: can("moderate videos"),
				canViewAllVideos: can("moderate videos") || can("view all videos"),
			}
		},

		get catalog() {
			return ops.value(state.readable.catalogOp) ?? []
		},

		get views() {
			return ops.value(state.readable.viewsOp) ?? []
		},

		get privileges() {
			return ops.value(state.readable.privilegesOp) ?? []
		},

		get shows() {
			return ops.value(state.readable.showsOp) ?? []
		},

		getView(label: string) {
			return (ops.value(state.readable.viewsOp) ?? [])
				.find(view => view.label === label)
		},

		getPrivilege(id: string) {
			return (ops.value(state.readable.privilegesOp) ?? [])
				.find(p => p.privilegeId === id)
		},

		getShow(label: string) {
			return (ops.value(state.readable.showsOp) ?? [])
				.find(show => show.label === label)
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
