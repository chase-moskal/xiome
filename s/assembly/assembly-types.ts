
import {Await} from "../types/fancy.js"
import {CoreTables} from "../features/auth/auth-types.js"

import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"

export type BackendSystems = Await<ReturnType<typeof assembleBackend>>
export type FrontendSystems = Await<ReturnType<typeof assembleFrontend>>

export type SystemTables = {
	core: CoreTables
}
