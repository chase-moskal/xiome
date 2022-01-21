
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

export namespace Database {
	export type NoteBase = {
		type: NoteType
		noteId: dbproxy.Id
		time: number
		to: null | dbproxy.Id
		from: null | dbproxy.Id
		title: string
		text: string
		old: boolean
	}
	export namespace NoteDetails {
		export type Message = {}
		export type Question = {
			questionId: dbproxy.Id
		}
		export type Any =
			| Message
			| Question
	}
}

export type NoteBase = UndatabaseIds<Database.NoteBase>

export type NoteType =
	| "message"
	| "question"

export interface Note<
			xDetails extends Database.NoteDetails.Any = Database.NoteDetails.Any
		> extends NoteBase {
	details: UndatabaseIds<xDetails>
}

export namespace Notes {
	export interface Message extends Note<Database.NoteDetails.Message> { type: "message" }
	export interface Question extends Note<Database.NoteDetails.Question> { type: "question" }
	export type Any =
		| Message
		| Question
}

export type DraftForNote<N extends Note> = Omit<N, "noteId" | "old" | "time">

export type UndatabaseIds<R extends dbproxy.Row> = {
	[P in keyof R]: R[P] extends dbproxy.Id
		? string
		: R[P]
}

export interface Pagination {
	offset: number
	limit: number
}

export interface NotesStats {
	newCount: number
	oldCount: number
}

export interface Paging {
	pageSize: number
	pageNumber: number
}
