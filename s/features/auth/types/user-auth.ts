import {BaseUserAuth} from "../policies/base/types/contexts/base-user-auth.js"
import {AnonAuth} from "./anon-auth.js"


export interface UserAuth extends AnonAuth, BaseUserAuth {}
