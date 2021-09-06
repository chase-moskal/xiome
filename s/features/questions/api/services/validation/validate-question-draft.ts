
import {AnswerDraft} from "../../types/answer-draft.js"
import {QuestionDraft} from "../../types/question-draft.js"
import {maxLength, minLength, notWhitespace, validator, schema, string} from "../../../../../toolbox/darkvalley.js"

export const validatePostContent = validator(
	string(),
	minLength(10),
	maxLength(280),
	notWhitespace(),
)

export const validateQuestionDraft = schema<QuestionDraft>({
	board: validator(string(), minLength(1), maxLength(32), notWhitespace()),
	content: validatePostContent,
})

export const validateAnswerDraft = schema<AnswerDraft>({
	content: validatePostContent,
})
