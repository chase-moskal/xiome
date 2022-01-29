
import {XiomeQuestions} from "./xiome-questions/xiome-questions.js"
import {mixinShare, mixinSnapstateSubscriptions} from "../../../framework/component.js"
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"

export function integrateQuestionsComponents({models, modals}: XiomeComponentOptions) {
	const {questionsModel} = models
	return {
		XiomeQuestions:
			mixinSnapstateSubscriptions(questionsModel.subscribe)(
				mixinShare({
						modals,
						questionsModel,
					})(
					XiomeQuestions
				)
			),
	}
}
