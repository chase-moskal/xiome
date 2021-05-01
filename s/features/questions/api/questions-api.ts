
import {Rando} from "../../../toolbox/get-rando.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {questionsPolicies} from "./questions-policies.js"
import {QuestionsTables} from "./tables/types/questions-tables.js"
import {questionPostingTopic} from "../topics/question-posting-topic.js"
import {questionReadingTopic} from "../topics/question-reading-topic.js"
import {questionModerationTopic} from "../topics/question-moderation-topic.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {QuestionModeratorAuth, QuestionModeratorMeta, QuestionPosterAuth, QuestionPosterMeta, QuestionReaderAuth, QuestionReaderMeta} from "./types/questions-persona.js"

export function questionsApi({
		rando, questionsTables, authPolicies, generateNickname
	}: {
		rando: Rando
		questionsTables: QuestionsTables
		authPolicies: ReturnType<typeof prepareAuthPolicies>
		generateNickname: () => string
	}) {

	const policies = questionsPolicies({
		authPolicies,
		questionsTables,
	})

	return {
		questionReadingService: apiContext<QuestionReaderMeta, QuestionReaderAuth>()({
			policy: policies.questionReader,
			expose: questionReadingTopic({generateNickname}),
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
