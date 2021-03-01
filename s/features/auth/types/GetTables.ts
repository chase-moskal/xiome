import {Tables} from "./Tables"


export type GetTables<T extends Tables> = ({}: {appId: string}) => Promise<T>
