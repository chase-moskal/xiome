
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyRow} from "../../../toolbox/dbby/dbby-types.js"
import {namespaceKeyAppId} from "../namespace-key-app-id.js"

export type WithAppNamespace<Row extends DbbyRow> = {
	[namespaceKeyAppId]: DamnId
} & Row
