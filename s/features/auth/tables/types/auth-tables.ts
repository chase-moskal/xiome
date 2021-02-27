
import {Await} from "../../../../types/fancy.js"
import {mockAuthTables} from "../mock-auth-tables.js"

export type AuthTables = Await<ReturnType<typeof mockAuthTables>>
