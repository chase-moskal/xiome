
import {apiContext} from "renraku/x/api/api-context.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {getCatalog} from "./routines/get-catalog.js"
import {videoPrivileges} from "../video-privileges.js"
import {getAllViews} from "./routines/get-all-views.js"
import {VideoTables} from "../../types/video-tables.js"
import {Dacast} from "../../dacast/types/dacast-types.js"
import {getVideoViews} from "./routines/get-video-views.js"
import {concurrent} from "../../../../toolbox/concurrent.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {getDacastEmbed} from "./routines/get-dacast-embed.js"
import {VideoAuth, VideoMeta} from "../../types/video-auth.js"
import {getDacastApiKey} from "./routines/get-dacast-api-key.js"
import {getAllPrivileges} from "./routines/get-all-privileges.js"
import {getDacastContent} from "./routines/get-dacast-content.js"
import {AnonAuth, AnonMeta} from "../../../auth/types/auth-metas.js"
import {setViewPermissions} from "./routines/set-view-permissions.js"
import {ingestDacastContent} from "./routines/ingest-dacast-content.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {VideoHosting, VideoModerationData, VideoShow} from "../../types/video-concepts.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"

export const makeContentService = ({
		config,
		dacastSdk,
		videoTables: rawVideoTables,
		basePolicy,
	}: {
		config: SecretConfig
		dacastSdk: Dacast.Sdk
		videoTables: UnconstrainedTables<VideoTables>
		basePolicy: Policy<AnonMeta, AnonAuth>
	}) => apiContext<VideoMeta, VideoAuth>()({

	policy: async(meta, request) => {
		const auth = await basePolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		const checker = makePrivilegeChecker(auth.access.permit, videoPrivileges)
		const engine = makePermissionsEngine({
			isPlatform: auth.access.appId === config.platform.appDetails.appId,
			permissionsTables: auth.authTables.permissions,
		})
		return {
			...auth,
			engine,
			checker,
			videoTables: rawVideoTables.namespaceForApp(appId),
		}
	},

	expose: {

		async fetchModerationData({
				access,
				authTables,
				videoTables,
				checker,
			}): Promise<VideoModerationData> {
			checker.requirePrivilege("moderate videos")
			return concurrent({
				views: getAllViews({videoTables}),
				privileges: getAllPrivileges({
					access,
					permissionsTables: authTables.permissions,
					platformAppId: config.platform.appDetails.appId,
				}),
				catalog: getDacastApiKey(videoTables)
					.then(async(apiKey): Promise<VideoHosting.AnyContent[]> =>
						apiKey
							? getCatalog({dacast: dacastSdk.getClient(apiKey)})
							: []
					),
			})
		},

		async writeView({videoTables, checker, engine}, {
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
				engine,
				privileges,
				videoTables,
			})
		},

		async deleteView({videoTables, checker}, {label}: {label: string}) {
			checker.requirePrivilege("moderate videos")
			await videoTables.viewDacast.delete(find({label}))
			await videoTables.viewPrivileges.delete(find({label}))
		},

		async getShows({videoTables, access, checker}, {labels}: {
				labels: string[]
			}) {
			const apiKey = await getDacastApiKey(videoTables)
			if (!apiKey)
				return []

			const views = await getVideoViews({
				labels,
				checker,
				videoTables,
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
								embed: embed.code,
							}
							: null,
					}
					return show
				})
			)
		},
	},
})
