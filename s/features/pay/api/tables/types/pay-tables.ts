
import {Await} from "../../../../../types/await.js"
import {mockPayTables} from "../../tables/mock-pay-tables.js"

export type PayTables = Await<ReturnType<typeof mockPayTables>>
