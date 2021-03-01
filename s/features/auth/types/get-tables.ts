import {Tables} from "./tables"


export type GetTables<T extends Tables> = ({}: {appId: string}) => Promise<T>
