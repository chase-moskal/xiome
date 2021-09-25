
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
import {DacastType, VideoCatalogItem, VideoView} from "../../types/video-concepts.js"
import {find, findAll} from "../../../../toolbox/dbby/dbby-helpers.js"
import {getDacastEmbed} from "./routines/get-dacast-embed.js"
import {getDacastApiKey} from "./routines/get-dacast-api-key.js"
import {setViewPermissions} from "./routines/set-view-permissions.js"
import {isPermittedToView} from "./routines/is-permitted-to-view.js"

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

		async fetchCatalog({videoTables, checker}): Promise<{
				vods: VideoCatalogItem.Any[]
				channels: VideoCatalogItem.Any[]
				playlists: VideoCatalogItem.Any[]
			}> {
			checker.requirePrivilege("moderate videos")
			const apiKey = await getDacastApiKey(videoTables)
			if (!apiKey)
				return {
					vods: [],
					channels: [],
					playlists: [],
				}
			const dacast = makeDacastClient({apiKey})
			const results = await concurrent({
				vods: dacast.vods.get(),
				channels: dacast.channels.get(),
				playlists: dacast.playlists.get(),
			})
			const convert = (type: DacastType, content: Dacast.Content) => ({
				type,
				id: content.id,
				thumb: content.thumbnail,
				provider: "dacast" as const,
			})
			return {
				vods: results.vods.map(x => convert("vod", x)),
				channels: results.channels.map(x => convert("channel", x)),
				playlists: results.playlists.map(x => convert("playlist", x)),
			}
		},

		async writeView({videoTables, checker}, {
				label, privileges, content,
			}: {
				label: string
				privileges: string[]
				content: VideoCatalogItem.Any
			}) {
			checker.requirePrivilege("moderate videos")
			await videoTables.viewDacast.update({
				...find({label}),
				whole: {
					label,
					type: content.type,
					dacastId: content.id,
				},
			})
			await setViewPermissions({
				label,
				privileges,
				videoTables,
			})
		},

		async getView({videoTables, access, checker}, {label}: {
				label: string
			}) {

			const apiKey = await getDacastApiKey(videoTables)
			if (!apiKey)
				return undefined

			const dacastRow = await videoTables.viewDacast.one(find({label}))
			if (!dacastRow)
				return undefined

			const privileges = await videoTables
				.viewPrivileges.read(find({label}))
				.then(rows => rows.map(row => row.privilegeId.toString()))

			const hasExplicitPrivilege = isPermittedToView({
				viewPrivileges: privileges,
				userPrivileges: access.permit.privileges,
			})
			if (!hasExplicitPrivilege && !checker.hasPrivilege("view all videos"))
				throw new Error(`user does not have access to video view "${label}"`)

			return <VideoView>{
				privileges,
				embed: await getDacastEmbed({
					dacast: makeDacastClient({apiKey}),
					type: dacastRow.type,
					id: dacastRow.dacastId,
				})
			}
		},
	},
})
