
import {Await} from "../../../types/await.js"
import {configureApiForNode} from "../configure-api-for-node.js"

export type SystemApi = Await<ReturnType<typeof configureApiForNode>>["api"]
