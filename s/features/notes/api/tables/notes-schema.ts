
import {Database} from "../../types/notes-concepts.js"
import * as dbmage from "dbmage"

export type NoteRow = Database.NoteBase
export type QuestionDetailRow = Database.NoteDetails.Question

export type NotesSchema = dbmage.AsSchema<{
	notes: NoteRow
	questionDetails: QuestionDetailRow
}>
