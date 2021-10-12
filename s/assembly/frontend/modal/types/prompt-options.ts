
import {ButtonOptions} from "./button-options.js"
import {Validator} from "../../../../toolbox/darkvalley.js"
import {TemplateResult} from "../../../../framework/component.js"
import {TextInputParser} from "../../../../features/xio-components/inputs/types/text-input-parser.js"

export interface PromptOptions<xValue> {
	input: {
		label: string
		textarea?: boolean
		validator?: Validator<xValue>
		parser?: TextInputParser<xValue>
	}
	title: string | TemplateResult
	body?: string | TemplateResult
	yes?: ButtonOptions
	no?: ButtonOptions
	focusNthElement?: number
	blanketClickMeansCancel?: boolean
}
