
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"

export type ExampleSchema = dbproxy.AsSchema<{
	examplePosts: ExamplePost
}>

export type ExamplePost = dbproxy.AsRow<{
	exampleId: dbproxy.Id
	something: string
}>
