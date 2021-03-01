
import {VerifyToken} from "redcrypto/dist/types.js"

import {Tables} from "./tables.js"
import {GetTables} from "./get-tables.js"

export type AuthProcessorPreparations<T extends Tables> = {
	getTables: GetTables<T>
	verifyToken: VerifyToken
}
