
import {ServiceFunction} from "./service-function.js"
import {AdministrativeApiOptions} from "./administrative-api-options.js"

export interface MakeServiceOptions extends AdministrativeApiOptions {
	service: ServiceFunction
}
