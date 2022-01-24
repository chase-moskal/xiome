
import * as renraku from "renraku"

import {ops} from "../../../framework/ops.js"
import {subbies} from "../../../toolbox/subbies.js"
import {UserMeta} from "../../auth/types/auth-metas.js"
import {makeNotesModel} from "../models/notes-model.js"
import {mockMeta} from "../../../common/testing/mock-meta.js"
import {makeNotesDepositBox} from "../api/notes-deposit-box.js"
import {makeNotesService} from "../api/services/notes-service.js"
import {prepareMockAuth} from "../../../common/testing/prepare-mock-auth.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

export async function notesTestingSetup() {
	const {
		rando, appId, config, authPolicies, storage, appOrigin, databaseRaw,
	} = await prepareMockAuth()

	const basePolicy = authPolicies.userPolicy
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

	const headers = {origin: appOrigin}
	const {access, database} = await basePolicy(meta, headers)

	const notesDepositBox = makeNotesDepositBox({
		rando,
		database,
	})

	const notesService = makeNotesService({
		config,
		basePolicy,
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
		const notesModel = makeNotesModel({
			notesService: renraku.mock()
				.forService(notesService)
				.withMeta(async() => meta, async() => headers)
		})
		await notesModel.updateAccessOp(ops.ready(access))
		orchestrateBroadcast(notesModel)
		return {
			notesModel,
			makeCacheAlreadySetup() {
				const {cache, setup} = notesModel.createNotesCacheDetails()
				setup()
				return cache
			},
		}
	}

	return {
		rando,
		access,
		userId,
		backend: {notesDepositBox},
		frontend: await browserTab(),
		browserTab,
	}
}
