
import {QuestionDraft} from "../../types/question-draft.js"
import {maxLength, minLength, notWhitespace, one, schema, string} from "../../../../../toolbox/darkvalley.js"

export const validateQuestionDraftContent = one(
	string(),
	minLength(10),
	maxLength(280),
	notWhitespace(),
)

export const validateQuestionDraft = schema<QuestionDraft>({
	board: one(string(), minLength(1), maxLength(32), notWhitespace()),
	content: validateQuestionDraftContent,
})
