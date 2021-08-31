
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"

export type LivestreamTables = {
	examplePosts: DbbyTable<ExamplePost>
}

export type ExamplePost = {
	exampleId: DamnId
	something: string
}
