
import {XiomeComponentOptions} from "../types/xiome-component-options.js"
import {mixinHappy, mixinShare} from "../../../../framework/component/component.js"
import {XiomeQuestions} from "../../../../features/questions/components/xiome-questions.js"

export function xiomeQuestionsComponents({models, modals}: XiomeComponentOptions) {
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
