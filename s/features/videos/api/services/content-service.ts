
import * as renraku from "renraku"
import {find} from "dbmage"

import {VideoMeta} from "../../types/video-auth.js"
import {getCatalog} from "./routines/get-catalog.js"
import {videoPrivileges} from "../video-privileges.js"
import {getAllViews} from "./routines/get-all-views.js"
import {VideoSchema} from "../../types/video-schema.js"
import {Dacast} from "../../dacast/types/dacast-types.js"
import {getVideoViews} from "./routines/get-video-views.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {getDacastEmbed} from "./routines/get-dacast-embed.js"
import {getDacastApiKey} from "./routines/get-dacast-api-key.js"
import {getAllPrivileges} from "./routines/get-all-privileges.js"
import {getDacastContent} from "./routines/get-dacast-content.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {setViewPermissions} from "./routines/set-view-permissions.js"
import {ingestDacastContent} from "./routines/ingest-dacast-content.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {VideoHosting, VideoModerationData, VideoShow} from "../../types/video-concepts.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"

export const makeContentService = ({
	config,
	dacastSdk,
	basePolicy,
}: {
	config: SecretConfig
	dacastSdk: Dacast.Sdk
	basePolicy: renraku.Policy<AnonMeta, AnonAuth>
}) => renraku.service()

.policy(async(meta: VideoMeta, headers) => {
	const auth = await basePolicy(meta, headers)
	const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
	const engine = makePermissionsEngine({
		isPlatform: auth.access.appId === config.platform.appDetails.appId,
		permissionsTables: auth.database.tables.auth.permissions,
	})
	return {
		...auth,
		engine,
		checker,
	}
})

.expose(({access, database, checker, engine}) => ({

	async fetchModerationData(): Promise<VideoModerationData> {
		checker.requirePrivilege("moderate videos")
		return concurrent({
			views: getAllViews({videoTables: database.tables.videos}),
			privileges: getAllPrivileges({
				access,
				permissionsTables: database.tables.auth.permissions,
				platformAppId: config.platform.appDetails.appId,
			}),
			catalog: getDacastApiKey(database.tables.videos)
				.then(async(apiKey): Promise<VideoHosting.AnyContent[]> =>
					apiKey
						? getCatalog({dacast: dacastSdk.getClient(apiKey)})
						: []
				),
		})
	},

	async writeView({
			label, privileges, reference,
		}: {
			label: string
			privileges: string[]
			reference: VideoHosting.AnyReference
		}) {
		checker.requirePrivilege("moderate videos")
		await database.tables.videos.viewDacast.update({
			...find({label}),
			whole: {
				label,
				type: reference.type,
				dacastId: reference.id,
			},
		})
		await setViewPermissions({
			label,
			engine,
			privileges,
			videoTables: database.tables.videos,
		})
	},

	async deleteView({label}: {label: string}) {
		checker.requirePrivilege("moderate videos")
		await database.tables.videos.viewDacast.delete(find({label}))
		await database.tables.videos.viewPrivileges.delete(find({label}))
	},

	async getShows({labels}: {labels: string[]}) {
		const apiKey = await getDacastApiKey(database.tables.videos)
		if (!apiKey)
			return []

		const views = await getVideoViews({
			labels,
			checker,
			videoTables: database.tables.videos,
			userPrivileges: access.permit.privileges,
		})

		const dacast = dacastSdk.getClient(apiKey)
		return Promise.all(
			views.map(async(view, index) => {
				const label = labels[index]
				if (!view)
					return {label, details: undefined}
				const [data, embed] = await Promise.all([
					getDacastContent({dacast, reference: view}),
					getDacastEmbed({dacast, reference: view}),
				])
				const show: VideoShow = {
					label,
					details: data
						? {
							...ingestDacastContent({
								type: view.type,
								data,
							}),
							embed: embed?.code,
						}
						: null,
				}
				return show
			})
		)
	},
}))
