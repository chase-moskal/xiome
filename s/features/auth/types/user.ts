import {PublicUserRole} from "./public-user-row.js"
import {Profile} from "./profile.js"

// auth types
//

export type User = {
	userId: string
	profile: Profile
	roles: PublicUserRole[]
	stats: {
		joined: number
	}
}
