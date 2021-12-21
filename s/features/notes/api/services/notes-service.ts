
import * as renraku from "renraku"

import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

import {NotesMeta} from "../types/notes-auth.js"
import {NotesTables} from "../tables/notes-tables.js"
import {find, findAll} from "../../../../toolbox/dbby/dbby-helpers.js"
import {Notes, NotesStats, Pagination} from "../../types/notes-concepts.js"

import {validatePagination} from "../validation/validate-pagination.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {array, boolean, each, maxLength, schema, validator} from "../../../../toolbox/darkvalley.js"

export const makeNotesService = ({
	config, basePolicy,
	notesTables: rawNotesTables,
}: {
	config: SecretConfig
	notesTables: UnconstrainedTables<NotesTables>
	basePolicy: renraku.Policy<UserMeta, UserAuth>
}) => renraku.service()

.policy(async(meta: NotesMeta, headers) => {
	const auth = await basePolicy(meta, headers)
	const appId = DamnId.fromString(auth.access.appId)
	return {
		...auth,
		notesTables: rawNotesTables.namespaceForApp(appId),
	}
})

.expose(({notesTables, access}) => ({

	async getNotesStats(): Promise<NotesStats> {
		const {userId} = access.user
		const newCount = await notesTables.notes.count(find({
			to: DamnId.fromString(userId),
			old: false
		}))
		const oldCount = await notesTables.notes.count(find({
			to: DamnId.fromString(userId),
			old: true
		}))
		return {newCount, oldCount}
	},

	async getNewNotes(pagination: Pagination): Promise<Notes.Any[]> {
		const {offset, limit} = runValidation(pagination, validatePagination)
		const {userId} = access.user

		const newNotes = await notesTables.notes.read({
			...find({
				to: DamnId.fromString(userId),
				old: false
			}),
			offset,
			limit,
			order: {time: "descend"}
		})

		return newNotes.map(note => ({
			type: "message",
			noteId: note.noteId.toString(),
			time: note.time,
			old: note.old,
			from: undefined,
			to: note.to.toString(),
			text: note.text,
			title: note.title,
			details: {},
		}))
	},

	async getOldNotes(pagination: Pagination): Promise<Notes.Any[]> {
		const {offset, limit} = runValidation(pagination, validatePagination)
		const {userId} = access.user

		const oldNotes = await notesTables.notes.read({
			...find({
				to: DamnId.fromString(userId),
				old: true
			}),
			offset,
			limit,
			order: {time: "descend"}
		})

		return oldNotes.map(note => ({
			type: "message",
			noteId: note.noteId.toString(),
			time: note.time,
			old: note.old,
			from: undefined,
			to: note.to.toString(),
			text: note.text,
			title: note.title,
			details: {},
		}))
	},

	async markAllNotesOld() {
		const {userId} = access.user
		await notesTables.notes.update({
			...find({
				to: DamnId.fromString(userId),
				old: false,
			}),
			write: {old:true},
		})
	},

	async markNotesNewOrOld(input: {
			old: boolean
			noteIds: string[]
		}) {

		const {userId} = access.user
		const {old, noteIds: noteIdStrings} = runValidation(input, schema({
			old: boolean(),
			noteIds: validator<string[]>(
				array(),
				maxLength(1000),
				each(validateId),
			),
		}))
		const noteIds = noteIdStrings.map(id => DamnId.fromString(id))
		const notes = await notesTables.notes.read(
			findAll(noteIds, noteId => ({noteId}))
		)

		for (const note of notes) {
			if (userId !== note.to.toString())
				throw new renraku.ApiError(
					403,
					`user is not privileged for note ${note.to.toString()}`
				)
		}

		await notesTables.notes.update({
			...findAll(noteIds, noteId => ({noteId})),
			write: {old}
		})
	}
}))
