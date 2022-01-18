
import {chatPostMaxLength} from "./chat-constants.js"
import {ChatDraft, ChatStatus} from "./types/chat-concepts.js"
import {validateId} from "../../../common/validators/validate-id.js"
import {array, each, max, maxLength, min, minLength, notWhitespace, number, schema, string, validator, zeroWhitespace} from "../../../toolbox/darkvalley.js"

export const validateChatRoom = validator<string>(
	string(),
	minLength(1),
	maxLength(32),
	zeroWhitespace(),
)

export const validateChatContent = validator<string>(
	string(),
	minLength(1),
	maxLength(chatPostMaxLength),
	notWhitespace(),
)

export const validateChatDraft = schema<ChatDraft>({
	content: validateChatContent,
})

export const validateIdArray = validator<string[]>(
	array(),
	each(validateId),
)

export const validateChatStatus = validator<ChatStatus>(
	number(),
	min(0),
	max(1),
)
