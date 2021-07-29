
import {Op} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {makeQuestionsPostingService} from "../../api/services/questions-posting-service.js"
import {makeQuestionsReadingService} from "../../api/services/questions-reading-service.js"
import {makeQuestionsAnsweringService} from "../../api/services/questions-answering-service.js"
import {makeQuestionsModerationService} from "../../api/services/questions-moderation-service.js"

export interface QuestionsModelOptions {
	questionsReadingService: Service<typeof makeQuestionsReadingService>
	questionsPostingService: Service<typeof makeQuestionsPostingService>
	questionsAnsweringService: Service<typeof makeQuestionsAnsweringService>
	questionsModerationService: Service<typeof makeQuestionsModerationService>
	getAccess: () => Op<AccessPayload>
}
