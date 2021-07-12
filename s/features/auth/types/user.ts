
import {Profile} from "./profile.js"
import {UserStats} from "./user-stats.js"
import {PublicUserRole} from "./public-user-role.js"

export type User = {
	userId: string
	profile: Profile
	roles: PublicUserRole[]
	stats: UserStats
}
