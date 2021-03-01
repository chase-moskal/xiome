import {PublicUserRole} from "./PublicUserRole.js"
import {Profile} from "./Profile.js"

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
