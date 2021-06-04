
import {asApi} from "renraku/x/identities/as-api.js"
import {QuestionsApiOptions} from "./types/questions-api-options.js"
import {questionsReadingParts} from "./services/questions-reading-parts.js"
import {questionsPostingParts} from "./services/questions-posting-parts.js"
import {assembleApiContext} from "../../../framework/api/assemble-api-context.js"
import {questionsModerationParts} from "./services/questions-moderation-parts.js"

export function questionsApi(options: QuestionsApiOptions) {
	return asApi({
		questionsReadingService: assembleApiContext(questionsReadingParts(options)),
		questionsPostingService: assembleApiContext(questionsPostingParts(options)),
		questionsModerationService: assembleApiContext(questionsModerationParts(options)),
	})
}
