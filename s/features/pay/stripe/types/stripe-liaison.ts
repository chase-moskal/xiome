
import {Await} from "../../../../types/await.js"
import {stripeLiaison} from "../stripe-liaison.js"

export type StripeLiaison = Await<ReturnType<typeof stripeLiaison>>
