import {UserAuth} from "./UserAuth.js"
import {StatsHub} from "./StatsHub.js"


export interface PlatformUserAuth extends UserAuth {
	statsHub: StatsHub
}
