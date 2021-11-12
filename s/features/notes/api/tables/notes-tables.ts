
import {Database} from "../../types/notes-concepts.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"

export type NoteRow = Database.NoteBase
export type QuestionDetailRow = Database.NoteDetails.Question

export type NotesTables = {
	notes: DbbyTable<NoteRow>
	questionDetails: DbbyTable<QuestionDetailRow>
}
