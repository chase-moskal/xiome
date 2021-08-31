
import {LivestreamTables} from "./livestream-tables.js"
import {UserAuth} from "../../../auth/types/auth-metas.js"

export interface LivestreamUserAuth extends UserAuth {
	exampleTables: LivestreamTables
}

export interface LivestreamAnonAuth extends UserAuth {
	exampleTables: LivestreamTables
}
