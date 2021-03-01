
import {UserAuth} from "./user-auth.js"
import {StatsHub} from "../../stats-hub/types/stats-hub.js"

export interface PlatformUserAuth extends UserAuth {
	statsHub: StatsHub
}
