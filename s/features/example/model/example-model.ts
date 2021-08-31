
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"

export function makeExampleModel(options: {}) {

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
