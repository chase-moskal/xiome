
import {VerifyToken} from "redcrypto/dist/types"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"

export type AuthPolicyOptions = {
	tables: AuthTables
	config: SecretConfig
	verifyToken: VerifyToken
}
