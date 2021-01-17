
import {Await} from "../../../types.js"
import {assembleFrontend} from "../../assemble-frontend.js"

export type FrontendSystems = Await<ReturnType<typeof assembleFrontend>>
