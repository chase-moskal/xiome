
import {Tables} from "./tables.js"

export type GetTables<T extends Tables> = ({}: {appId: string}) => Promise<T>
