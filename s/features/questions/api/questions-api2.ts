
import {asApi} from "renraku/x/identities/as-api.js"
import {QuestionsApiOptions} from "./types/questions-api-options.js"
import {questionsReadingService} from "./services/questions-reading-service.js"

export function makeQuestionsApi(options: QuestionsApiOptions) {
	return asApi({
		questionsReadingService: questionsReadingService(options),
	})
}
