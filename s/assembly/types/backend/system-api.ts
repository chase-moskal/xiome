
import {Await} from "../../../types.js"
import {assembleApi} from "../../backend/assemble-api.js"

export type SystemApi = Await<ReturnType<typeof assembleApi>>
