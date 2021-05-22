
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {mixinAutotrack, mixinShare} from "../../../framework/component2/component2.js"
import {XiomeQuestions} from "../../../features/questions/components/xiome-questions.js"

export function xiomeQuestionsComponents({models, modals}: XiomeComponentOptions) {
	const {questionsModel} = models
	return {
		XiomeQuestions:
			mixinShare({
				modals,
				questionsModel,
			})(XiomeQuestions)
	}
}
