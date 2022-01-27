
import * as dbmage from "dbmage"

export namespace Database {
	export type NoteBase = {
		type: NoteType
		noteId: dbmage.Id
		time: number
		to: null | dbmage.Id
		from: null | dbmage.Id
		title: string
		text: string
		old: boolean
	}
	export namespace NoteDetails {
		export type Message = {}
		export type Question = {
			questionId: dbmage.Id
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

export type UndatabaseIds<R extends dbmage.Row> = {
	[P in keyof R]: R[P] extends dbmage.Id
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
