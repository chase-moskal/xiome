
import {Await} from "../../../../types/fancy.js"
import {stripeLiaison} from "../stripe-liaison.js"

export type StripeLiaison = Await<ReturnType<typeof stripeLiaison>>
