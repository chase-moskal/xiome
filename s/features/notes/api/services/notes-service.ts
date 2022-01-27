
import * as renraku from "renraku"
import * as dbmage from "dbmage"
import {Id, find, findAll} from "dbmage"

import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"

import {NotesMeta} from "../types/notes-auth.js"
import {NotesSchema} from "../tables/notes-schema.js"
import {Notes, NotesStats, Pagination} from "../../types/notes-concepts.js"

import {validatePagination} from "../validation/validate-pagination.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {array, boolean, each, maxLength, schema, validator} from "../../../../toolbox/darkvalley.js"

export const makeNotesService = ({
	config, basePolicy,
}: {
	config: SecretConfig
	basePolicy: renraku.Policy<UserMeta, UserAuth>
}) => renraku.service()

.policy(async(meta: NotesMeta, headers) => {
	const auth = await basePolicy(meta, headers)
	return {
		...auth,
		notesDatabase: (<dbmage.Database<NotesSchema>>
			dbmage.subsection(auth.database, tables => tables.notes))
		,
	}
})

.expose(({notesDatabase, access}) => ({

	async getNotesStats(): Promise<NotesStats> {
		const {userId} = access.user
		const newCount = await notesDatabase.tables.notes.count(find({
			to: Id.fromString(userId),
			old: false
		}))
		const oldCount = await notesDatabase.tables.notes.count(find({
			to: Id.fromString(userId),
			old: true
		}))
		return {newCount, oldCount}
	},

	async getNewNotes(pagination: Pagination): Promise<Notes.Any[]> {
		const {offset, limit} = runValidation(pagination, validatePagination)
		const {userId} = access.user

		const newNotes = await notesDatabase.tables.notes.read({
			...find({
				to: Id.fromString(userId),
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

		const oldNotes = await notesDatabase.tables.notes.read({
			...find({
				to: Id.fromString(userId),
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
		await notesDatabase.tables.notes.update({
			...find({
				to: Id.fromString(userId),
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
		const noteIds = noteIdStrings.map(id => Id.fromString(id))
		const notes = await notesDatabase.tables.notes.read(
			findAll(noteIds, noteId => ({noteId}))
		)

		for (const note of notes) {
			if (userId !== note.to.toString())
				throw new renraku.ApiError(
					403,
					`user is not privileged for note ${note.to.toString()}`
				)
		}

		await notesDatabase.tables.notes.update({
			...findAll(noteIds, noteId => ({noteId})),
			write: {old}
		})
	}
}))
