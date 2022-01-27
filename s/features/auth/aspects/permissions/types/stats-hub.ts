
import {Id} from "dbmage"

export interface StatsHub {
	countUsers(appId: Id): Promise<number>
	countUsersActiveDaily(appId: Id): Promise<number>
	countUsersActiveMonthly(appId: Id): Promise<number>
}
