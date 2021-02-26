
import {Await} from "../../../../../../types/fancy.js"
import {mockStripeTables} from "../mock-stripe-tables.js"

export type MockStripeTables = Await<ReturnType<typeof mockStripeTables>>
