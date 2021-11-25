
import {Database} from "../../types/notes-concepts.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"

export type NoteRow = Database.NoteBase
export type QuestionDetailRow = Database.NoteDetails.Question

export type UserNotesSettingsRow = {
	userId: DamnId
	emailEnabled: boolean
}

export type NotesTables = {
	notes: DbbyTable<NoteRow>
	questionDetails: DbbyTable<QuestionDetailRow>
	userSettings: DbbyTable<UserNotesSettingsRow>
}
