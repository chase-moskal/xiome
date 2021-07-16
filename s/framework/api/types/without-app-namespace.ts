
import {DbbyRow} from "../../../toolbox/dbby/dbby-types.js"
import {namespaceKeyAppId} from "../namespace-key-app-id.js"

export type WithoutAppNamespace<Row extends DbbyRow> = Omit<Row, typeof namespaceKeyAppId>
