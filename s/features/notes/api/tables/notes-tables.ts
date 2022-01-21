
import {Database} from "../../types/notes-concepts.js"
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"


export type NoteRow = Database.NoteBase
export type QuestionDetailRow = Database.NoteDetails.Question

export type NotesTables = dbproxy.AsSchema<{
	notes: NoteRow
	questionDetails: QuestionDetailRow
}>
