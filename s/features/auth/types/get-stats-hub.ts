
import {StatsHub} from "./stats-hub.js"

export type GetStatsHub = (userId: string) => Promise<StatsHub>
