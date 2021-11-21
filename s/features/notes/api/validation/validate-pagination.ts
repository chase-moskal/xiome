
import {Pagination} from "../../types/notes-concepts.js"
import {max, min, number, schema, validator} from "../../../../toolbox/darkvalley.js"

const maxNotesPerPage = 100

export const validatePagination = schema<Pagination>({
	offset: validator<number>(number(), min(0)),
	limit: validator<number>(number(), min(0), max(maxNotesPerPage))
})
