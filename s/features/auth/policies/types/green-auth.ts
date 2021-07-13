
import {AuthTables} from "../../tables/types/auth-tables.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"

export type GreenAuth = {
	bakeTables: (appId: DamnId) => Promise<AuthTables>
}
