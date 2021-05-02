
import {AccessPayload} from "../../types/tokens/access-payload.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
