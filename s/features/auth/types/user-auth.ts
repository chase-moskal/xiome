
import {AnonAuth} from "./anon-auth.js"
import {BaseUserAuth} from "../policies/base/types/contexts/base-user-auth.js"

export interface UserAuth extends AnonAuth, BaseUserAuth {}
