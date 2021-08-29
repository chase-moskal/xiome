
import {asApi} from "renraku/x/identities/as-api.js"
import {ExampleApiOptions} from "./types/example-api-options.js"
import {makeExampleService} from "./services/example-service.js"

export function exampleApi(options: ExampleApiOptions) {
	return asApi({
		exampleService: makeExampleService(options),
	})
}
