
export interface StatsHub {
	countUsers(id_app: string): Promise<number>
	countUsersActiveDaily(id_app: string): Promise<number>
	countUsersActiveMonthly(id_app: string): Promise<number>
}
