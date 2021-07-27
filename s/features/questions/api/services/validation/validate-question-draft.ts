
import {AnswerDraft} from "../../types/answer-draft.js"
import {QuestionDraft} from "../../types/question-draft.js"
import {maxLength, minLength, notWhitespace, one, schema, string} from "../../../../../toolbox/darkvalley.js"

export const validatePostContent = one(
	string(),
	minLength(10),
	maxLength(280),
	notWhitespace(),
)

export const validateQuestionDraft = schema<QuestionDraft>({
	board: one(string(), minLength(1), maxLength(32), notWhitespace()),
	content: validatePostContent,
})

export const validateAnswerDraft = schema<AnswerDraft>({
	content: validatePostContent,
})
