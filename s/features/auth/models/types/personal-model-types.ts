
import { Business } from "renraku/x/types/primitives/business"
import {User, Settings, AuthApi} from "../../auth-types.js"

export interface Personal {
	user: User
	settings: Settings
}

export interface PersonalModelOptions {
	personal: Business<AuthApi["personal"]>
	reauthorize: () => Promise<void>
}
