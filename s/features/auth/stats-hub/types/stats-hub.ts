
export interface StatsHub {
	countUsers(appId: string): Promise<number>
	countUsersActiveDaily(appId: string): Promise<number>
	countUsersActiveMonthly(appId: string): Promise<number>
}
