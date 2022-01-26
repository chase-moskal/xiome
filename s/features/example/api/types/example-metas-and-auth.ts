
import {ExampleSchema} from "./example-tables.js"
import {UserAuth} from "../../../auth/types/auth-metas.js"

export interface ExampleUserAuth extends UserAuth {
	exampleTables: ExampleSchema
}

export interface ExampleAnonAuth extends UserAuth {
	exampleTables: ExampleSchema
}
