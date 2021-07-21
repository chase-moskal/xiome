
import {User} from "../../../auth/aspects/users/types/user.js"

export interface UserResult {
	user: User
	roleIds: string[]
}
