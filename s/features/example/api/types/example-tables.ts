
import * as dbmage from "dbmage"

export type ExampleSchema = dbmage.AsSchema<{
	examplePosts: ExamplePost
}>

export type ExamplePost = dbmage.AsRow<{
	exampleId: dbmage.Id
	something: string
}>
