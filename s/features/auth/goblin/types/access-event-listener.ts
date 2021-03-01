
import {AccessPayload} from "../../types/access-payload"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
