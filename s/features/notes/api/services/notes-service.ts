
import {apiContext} from "renraku/x/api/api-context.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

import {Notes, NotesStats, Pagination} from "../../types/notes-concepts.js"
import {NotesTables} from "../tables/notes-tables.js"
import {NotesAuth, NotesMeta} from "../types/notes-auth.js"

export const makeNotesService = ({
		config, basePolicy,
		notesTables: rawNotesTables,
	}: {
		config: SecretConfig
		notesTables: UnconstrainedTables<NotesTables>
		basePolicy: Policy<UserMeta, UserAuth>
	}) => apiContext<NotesMeta, NotesAuth>()({

	async policy(meta, request) {
		const auth = await basePolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		return {
			...auth,
			notesTables: rawNotesTables.namespaceForApp(appId),
		}
	},

	expose: {

		async getNotesStats({notesTables}): Promise<NotesStats> {
			return {
				newCount: 123,
				oldCount: 321,
			}
		},

		async getNewNotes(
				{notesTables},
				{offset, limit}: Pagination
			): Promise<Notes.Any[]> {
			return [
				{
					type: "message",
					noteId: undefined,
					time: Date.now(),
					old: false,
					from: undefined,
					to: undefined,
					text: "text",
					title: "title",
					details: {},
				}
			]
		},

		async getOldNotes(
				{notesTables},
				{offset, limit}: Pagination
			): Promise<Notes.Any[]> {
			return [
				{
					type: "message",
					noteId: undefined,
					time: Date.now(),
					old: false,
					from: undefined,
					to: undefined,
					text: "text",
					title: "title",
					details: {},
				}
			]
		},
	},
})
