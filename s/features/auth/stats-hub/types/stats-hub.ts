
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"

export interface StatsHub {
	countUsers(appId: DamnId): Promise<number>
	countUsersActiveDaily(appId: DamnId): Promise<number>
	countUsersActiveMonthly(appId: DamnId): Promise<number>
}
