import {StatsHub} from "./StatsHub.js"


export type GetStatsHub = (userId: string) => Promise<StatsHub>
