
import {Await} from "../../../types/await.js"
import {backendForNode} from "../backend-for-node.js"

export type SystemApi = Await<ReturnType<typeof backendForNode>>["api"]
