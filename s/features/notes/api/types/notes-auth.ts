
import {NotesTables} from "../tables/notes-tables.js"
import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"

export interface NotesMeta extends UserMeta {}

export interface NotesAuth extends UserAuth {
	notesTables: NotesTables
}
