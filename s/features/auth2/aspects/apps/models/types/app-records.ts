
import {Op} from "../../../../../../framework/ops.js"
import {AppDisplay} from "../../../../../auth/types/apps/app-display.js"

export type AppRecords = {[key: string]: Op<AppDisplay>}
