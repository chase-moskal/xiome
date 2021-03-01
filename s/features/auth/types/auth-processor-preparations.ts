import {VerifyToken} from "redcrypto/dist/types.js"
import {GetTables} from "./get-tables"
import {Tables} from "./tables"


export type AuthProcessorPreparations<T extends Tables> = {
	getTables: GetTables<T>
	verifyToken: VerifyToken
}
