
import {Rando} from "../../../toolbox/get-rando.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {QuestionsTables} from "./tables/types/questions-tables.js"
import {questionPostingTopic} from "../topics/question-posting-topic.js"
import {questionReadingTopic} from "../topics/question-reading-topic.js"
import {questionModerationTopic} from "../topics/question-moderation-topic.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {QuestionModeratorAuth, QuestionModeratorMeta, QuestionPosterAuth, QuestionPosterMeta, QuestionReaderAuth, QuestionReaderMeta, questionsPolicies} from "./questions-policies.js"

export function questionsApi({rando, questionsTables, authPolicies}: {
	rando: Rando
	questionsTables: QuestionsTables
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}) {

	const policies = questionsPolicies({
		authPolicies,
		questionsTables,
	})

	return {
		questionReadingService: apiContext<QuestionReaderMeta, QuestionReaderAuth>()({
			policy: policies.questionReader,
			expose: questionReadingTopic(),
		}),
		questionPostingService: apiContext<QuestionPosterMeta, QuestionPosterAuth>()({
			policy: policies.questionPoster,
			expose: questionPostingTopic({rando}),
		}),
		questionModerationService: apiContext<QuestionModeratorMeta, QuestionModeratorAuth>()({
			policy: policies.questionModerator,
			expose: questionModerationTopic(),
		}),
	}
}
