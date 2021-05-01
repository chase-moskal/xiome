
import {Policy} from "renraku/x/types/primitives/policy.js"
import {QuestionsTables} from "./tables/types/questions-tables.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {prepareNamespacerForTables} from "../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"
import {QuestionModeratorAuth, QuestionModeratorMeta, QuestionPosterAuth, QuestionPosterMeta, QuestionReaderAuth, QuestionReaderMeta} from "./types/questions-persona.js"

export function questionsPolicies({authPolicies, questionsTables}: {
		questionsTables: QuestionsTables
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	}) {

	async function questionsAuthProcessing(appId: string) {
		return {
			questionsTables: await prepareNamespacerForTables(questionsTables)(appId),
		}
	}

	const questionReader: Policy<QuestionReaderMeta, QuestionReaderAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.anon.processAuth(meta, request)
			return {
				...auth,
				...await questionsAuthProcessing(auth.app.appId),
			}
		},
	}

	const questionPoster: Policy<QuestionPosterMeta, QuestionPosterAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			return {
				...auth,
				...await questionsAuthProcessing(auth.app.appId),
			}
		},
	}

	const questionModerator: Policy<QuestionModeratorMeta, QuestionModeratorAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			auth.checker.requirePrivilege("moderate questions")
			return {
				...auth,
				...await questionsAuthProcessing(auth.app.appId),
			}
		},
	}

	return {
		questionReader,
		questionPoster,
		questionModerator,
	}
}
