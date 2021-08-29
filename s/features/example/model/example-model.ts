
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {ExampleModelOptions} from "./types/example-model-options.js"

export function makeExampleModel(options: ExampleModelOptions) {

	const happy = happystate({
		state: {},
		actions: state => ({}),
	})

	return {
		...happy,
		accessChange: (access: AccessPayload) => {

		}
	}
}
