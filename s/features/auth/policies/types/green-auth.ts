
import {AuthTables} from "../../tables/types/auth-tables.js"

export type GreenAuth = {
	bakeTables: (appId: string) => Promise<AuthTables>
}
