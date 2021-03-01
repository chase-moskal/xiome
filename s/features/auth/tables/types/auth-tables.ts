
import {Await} from "../../../../types/await.js"
import {mockAuthTables} from "../mock-auth-tables.js"

export type AuthTables = Await<ReturnType<typeof mockAuthTables>>
