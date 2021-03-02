
import {VerifyToken} from "redcrypto/dist/types"

import {AuthTables} from "../../tables/types/auth-tables.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export type AuthPolicyOptions = {
	tables: AuthTables
	config: PlatformConfig
	verifyToken: VerifyToken
}
