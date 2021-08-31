
import {LivestreamTables} from "./livestream-tables.js"
import {AnonAuth} from "../../../auth/types/auth-metas.js"

export interface LivestreamAuth extends AnonAuth {
	livestreamTables: LivestreamTables
}
