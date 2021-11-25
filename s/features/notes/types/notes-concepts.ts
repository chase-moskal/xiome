
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyRow} from "../../../toolbox/dbby/dbby-types.js"

export namespace Database {
	export type NoteBase = {
		type: NoteType
		noteId: DamnId
		time: number
		to: null | DamnId
		from: null | DamnId
		title: string
		text: string
		old: boolean
	}
	export namespace NoteDetails {
		export type Message = {}
		export type Question = {
			questionId: DamnId
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

export type UndatabaseIds<R extends DbbyRow> = {
	[P in keyof R]: R[P] extends DamnId
		? string
		: R[P]
}

export interface Pagination {
	offset: number
	limit: number
}

export interface NotesStats {
	email: string
	emailEnabled: boolean
	newCount: number
	oldCount: number
}

export interface Paging {
	pageSize: number
	pageNumber: number
}
