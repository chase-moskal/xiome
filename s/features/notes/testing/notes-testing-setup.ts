
import {mockRemote} from "renraku/x/remote/mock-remote.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"
import {mockHttpRequest} from "renraku/x/remote/mock-http-request.js"

import {ops} from "../../../framework/ops.js"
import {subbies} from "../../../toolbox/subbies.js"
import {UserMeta} from "../../auth/types/auth-metas.js"
import {makeNotesModel} from "../models/notes-model.js"
import {mockMeta} from "../../auth/testing/mock-meta.js"
import {NotesTables} from "../api/tables/notes-tables.js"
import {prepareMockAuth} from "./basics/prepare-mock-auth.js"
import {makeNotesDepositBox} from "../api/notes-deposit-box.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export async function notesTestingSetup() {
	const {
		rando, appId, config, authPolicies, storage, appOrigin,
	} = await prepareMockAuth()

	const notesTables = new UnconstrainedTables(
		await mockStorageTables<NotesTables>(storage, {
			notes: true,
			questionDetails: true,
		})
	)

	const basePolicy = authPolicies.userPolicy
	const rawNotesService = makeNotesService({
		config,
		notesTables,
		basePolicy,
	})
	const userId = rando.randomId().toString()
	const meta = await mockMeta<UserMeta>({
		access: {
			appId: appId.toString(),
			origins: [appOrigin],
			permit: {privileges: [appPermissions.privileges["universal"]]},
			scope: {core: true},
			user: {
				userId: userId.toString(),
				profile: {
					avatar: undefined,
					nickname: "Steven Seagal",
					tagline: "totally ripped and sweet",
				},
				roles: [],
				stats: {joined: Date.now()},
			},
		},
	})
	const request = mockHttpRequest({origin: appOrigin}) as any as HttpRequest
	const {access} = await basePolicy(meta, request)

	const notesDepositBox = makeNotesDepositBox({
		rando,
		notesTables: notesTables.namespaceForApp(appId),
	})

	const broadcast = subbies<ReturnType<typeof makeNotesModel>>()

	function orchestrateBroadcast(notesModel: ReturnType<typeof makeNotesModel>) {
		notesModel.propagateChangeToOtherTabs.subscribe(() => {
			broadcast.publish(notesModel)
		})
		broadcast.subscribe(originModel => {
			if (notesModel !== originModel)
				notesModel.overwriteStatsOp(originModel.state.statsOp)
		})
	}

	async function browserTab() {
		const notesService = mockRemote(rawNotesService).withMeta({meta, request})
		const notesModel = makeNotesModel({notesService})
		await notesModel.updateAccessOp(ops.ready(access))
		orchestrateBroadcast(notesModel)
		return {
			notesModel,
			async prepareCache() {
				const cache = notesModel.createNotesCache()
				await cache.fetchAppropriateNotes()
				return cache
			}
		}
	}

	return {
		rando,
		userId,
		backend: {notesDepositBox},
		frontend: await browserTab(),
		browserTab,
	}
}
