
import {Await} from "../../../../../types/await.js"
import {mockStoreTables} from "../mock-store-tables.js"

export type StoreTables = Await<ReturnType<typeof mockStoreTables>>
