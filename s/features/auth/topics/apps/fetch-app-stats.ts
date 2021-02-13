
import {AppStats} from "../../types/apps/app-stats.js"

export async function fetchAppStats(appId: string): Promise<AppStats> {
	return {
		users: 8888,
		activeDaily: 8888,
		activeMonthly: 8888,
	}
}
