
import {apiContext} from "renraku/x/api/api-context.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {videoPrivileges} from "../video-privileges.js"
import {VideoTables, ViewPrivilegeRow} from "../../types/video-tables.js"
import * as Dacast from "../../dacast/types/dacast-types.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {VideoAuth, VideoMeta} from "../../types/video-auth.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {VideoHosting, VideoShow, VideoView} from "../../types/video-concepts.js"
import {find, findAll} from "../../../../toolbox/dbby/dbby-helpers.js"
import {getDacastEmbed} from "./routines/get-dacast-embed.js"
import {getDacastApiKey} from "./routines/get-dacast-api-key.js"
import {setViewPermissions} from "./routines/set-view-permissions.js"
import {isPermittedToView} from "./routines/is-permitted-to-view.js"
import {getVideoView} from "./routines/get-video-view.js"
import {getDacastContent} from "./routines/get-dacast-content.js"
import {ingestDacastContent} from "./routines/ingest-dacast-content.js"
import {ApiError} from "../../../../../../renraku/x/api/api-error.js"
import {viewPrivilege} from "../../testing/video-setup.js"

export const makeContentService = ({
		makeDacastClient,
		videoTables: rawVideoTables,
		basePolicy,
	}: {
		makeDacastClient: Dacast.MakeClient
		videoTables: UnconstrainedTables<VideoTables>
		basePolicy: Policy<AnonMeta, AnonAuth>
	}) => apiContext<VideoMeta, VideoAuth>()({

	policy: async(meta, request) => {
		const auth = await basePolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
		return {
			...auth,
			checker,
			videoTables: rawVideoTables.namespaceForApp(appId),
		}
	},

	expose: {

		async fetchCatalog({videoTables, checker}): Promise<VideoHosting.AnyContent[]> {
			checker.requirePrivilege("moderate videos")
			const apiKey = await getDacastApiKey(videoTables)
			if (!apiKey)
				return []
			const dacast = makeDacastClient({apiKey})
			const results = await concurrent({
				vods: dacast.vods.get(),
				channels: dacast.channels.get(),
				playlists: dacast.playlists.get(),
			})
			const convert = (
					type: VideoHosting.DacastType,
					contentFromDacast: Dacast.Content
				) => ingestDacastContent({
				type,
				contentFromDacast,
			})
			return [
				...results.vods.map(x => convert("vod", x)),
				...results.channels.map(x => convert("channel", x)),
				...results.playlists.map(x => convert("playlist", x)),
			]
		},

		async writeView({videoTables, checker}, {
				label, privileges, reference,
			}: {
				label: string
				privileges: string[]
				reference: VideoHosting.AnyReference
			}) {
			checker.requirePrivilege("moderate videos")
			await videoTables.viewDacast.update({
				...find({label}),
				whole: {
					label,
					type: reference.type,
					dacastId: reference.id,
				},
			})
			await setViewPermissions({
				label,
				privileges,
				videoTables,
			})
		},

		async getViews({videoTables, checker}): Promise<VideoView[]> {
			checker.requirePrivilege("moderate videos")
			const viewDacastRows = await videoTables.viewDacast.read({
				conditions: false,
			})
			const viewPrivilegeRows = await videoTables.viewPrivileges.read({
				conditions: false,
			})
			return viewDacastRows.map(dacastRow => {
				const privileges = viewPrivilegeRows
					.filter(privilegeRow => privilegeRow.label === dacastRow.label)
					.map(r => r.privilegeId.toString())
				return {
					id: dacastRow.dacastId,
					label: dacastRow.label,
					privileges,
					provider: "dacast",
					type: dacastRow.type,
				}
			})
		},

		async deleteView({videoTables}, {label}: {label: string}) {
			await videoTables.viewDacast.delete(find({label}))
		},

		async getShow({videoTables, access, checker}, {label}: {
				label: string
			}): Promise<VideoShow> {
			const apiKey = await getDacastApiKey(videoTables)
			if (!apiKey)
				return undefined
			const view = await getVideoView({
				label,
				checker,
				videoTables,
				userPrivileges: access.permit.privileges,
			})
			if (!view)
				return undefined
			const dacast = makeDacastClient({apiKey})
			const contentFromDacast = await getDacastContent({
				dacast,
				reference: view,
			})
			const embed = await getDacastEmbed({
				dacast: makeDacastClient({apiKey}),
				reference: view,
			})
			return {
				...ingestDacastContent({
					type: view.type,
					contentFromDacast
				}),
				label,
				embed,
			}
		},
	},
})
