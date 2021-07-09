
import {AuthTables} from "../../tables/types/auth-tables.js"

export type GreenAuth = {
	bakeTables: (id_app: string) => Promise<AuthTables>
}
