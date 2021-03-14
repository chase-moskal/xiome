
import {Await} from "../../../../../types/await.js"
import {mockStoreTables} from "../mock-store-tables.js"

export type PayTables = Await<ReturnType<typeof mockStoreTables>>
