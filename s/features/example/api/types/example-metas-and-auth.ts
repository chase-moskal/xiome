
import {ExampleTables} from "./example-tables.js"
import {UserAuth} from "../../../auth/types/auth-metas.js"

export interface ExampleUserAuth extends UserAuth {
	exampleTables: ExampleTables
}

export interface ExampleAnonAuth extends UserAuth {
	exampleTables: ExampleTables
}
