
import {mixinShare} from "../../../framework/component2/component2.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {mixinHappy} from "../../../framework/component2/mixins/mixin-happy.js"
import {XiomeQuestions} from "../../../features/questions/components/xiome-questions.js"

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
