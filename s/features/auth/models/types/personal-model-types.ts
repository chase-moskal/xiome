
import {GetApi} from "../../../../types.js"
import {User, Settings, AuthApi} from "../../auth-types.js"

export interface Personal {
	user: User
	settings: Settings
}

export interface PersonalModelOptions {
	getAuthApi: GetApi<AuthApi>
	reauthorize: () => Promise<void>
}
