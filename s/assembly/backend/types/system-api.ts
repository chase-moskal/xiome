
import {Await} from "../../../types/fancy.js"
import {mockBackend} from "../mock-backend.js"

export type SystemApi = Await<ReturnType<typeof mockBackend>>["api"]
