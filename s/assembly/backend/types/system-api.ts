
import {Await} from "../../../types/await.js"
import {configureApi} from "../configure-api.js"

export type SystemApi = Await<ReturnType<typeof configureApi>>["api"]
