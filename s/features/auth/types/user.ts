
import {Profile} from "./profile.js"
import {PublicUserRole} from "./public-user-row.js"

export type User = {
	userId: string
	profile: Profile
	roles: PublicUserRole[]
	stats: {
		joined: number
	}
}
