
import {XiomeComponentOptions} from "../../../assembly/frontend/components/types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../framework/component.js"
import {XiomeQuestions} from "./xiome-questions/xiome-questions.js"

export function integrateQuestionsComponents({models, modals}: XiomeComponentOptions) {
	const {questionsModel} = models
	return {
		XiomeQuestions:
			mixinHappy(questionsModel.onStateChange)(
				mixinShare({
					modals,
					questionsModel,
				})(XiomeQuestions)
			),
	}
}
