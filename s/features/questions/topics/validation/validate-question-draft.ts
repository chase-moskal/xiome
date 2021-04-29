
import {maxLength, minLength, notWhitespace, one, schema, string} from "../../../../toolbox/darkvalley.js"
import {QuestionDraft} from "../types/question-draft.js"

export const validateQuestionDraft = schema<QuestionDraft>({
	board: one(string(), minLength(1), maxLength(32), notWhitespace()),
	content: one(string(), minLength(10), maxLength(256), notWhitespace()),
})
