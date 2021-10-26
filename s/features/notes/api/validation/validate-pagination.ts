import {max, min, number, schema, Validator, validator} from "../../../../toolbox/darkvalley.js"
import {Pagination} from "../../types/notes-concepts.js"

const maxNotesPerPage = 100

export const validatePagination = schema<Pagination>({
	offset: validator<number>(number(), min(0)),
	limit: validator<number>(number(), min(0), max(maxNotesPerPage))
})
