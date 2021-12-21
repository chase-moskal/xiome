
import * as renraku from "renraku"
import {ExampleApiOptions} from "./types/example-api-options.js"
import {makeExampleService} from "./services/example-service.js"

export function exampleApi(options: ExampleApiOptions) {
	return renraku.api({
		exampleService: makeExampleService(options),
	})
}
