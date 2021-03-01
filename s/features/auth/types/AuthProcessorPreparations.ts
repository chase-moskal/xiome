import {VerifyToken} from "redcrypto/dist/types.js"
import {GetTables} from "./GetTables"
import {Tables} from "./Tables"


export type AuthProcessorPreparations<T extends Tables> = {
	getTables: GetTables<T>
	verifyToken: VerifyToken
}
