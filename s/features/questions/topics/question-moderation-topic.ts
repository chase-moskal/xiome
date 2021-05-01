
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {QuestionModeratorAuth} from "../api/types/questions-persona.js"

export const questionModerationTopic = () => asTopic<QuestionModeratorAuth>()({

	async archiveBoard(
			{questionsTables},
			{board}: {board: string}
		) {

		await questionsTables.questionPosts.update({
			...find({board}),
			write: {archive: true},
		})
	},
})
